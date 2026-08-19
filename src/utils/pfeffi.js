// ─── GLÜCKS-PFEFFI — Google Apps Script als Backend ───
// Gesamt- und Stunden-Kontingent liegen serverseitig im Apps Script
// (Sheet "Pfeffi"), damit die Chance/Zähler nicht im Client manipulierbar
// sind. Setup-Anleitung + Script-Quelltext: apps-script/pfeffi.gs

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwglcfSE7Doav6dvS_BV16isPJ5VaVR0O71nfVoh4b6j_KbeiIDR7UCWbIPdviEfRK2Iw/exec'

export const PFEFFI_COOLDOWN_MS = 30 * 60 * 1000 // 30 Minuten — muss zu apps-script/pfeffi.gs passen

// Wie lange der Gewinn-Screen nach dem Gewinn einlösbar bleibt. Danach zeigt
// die App eine "abgelaufen"-Meldung statt des Gewinn-Screens — verhindert,
// dass derselbe Screen Stunden später bei einer anderen Bar-Schicht nochmal
// vorgezeigt wird.
export const PFEFFI_REDEMPTION_WINDOW_MS = 30 * 60 * 1000

// Letzter möglicher Zeitpunkt zum Würfeln: Samstagnacht macht die Bar
// endgültig zu (keine Wiedereröffnung wie zwischen Freitag und Samstag) —
// ab hier reicht die Zeit nicht mehr sicher für Würfeln + Weg zur Bar.
export const PFEFFI_LAST_DRAW = new Date(2026, 7, 29, 23, 50, 0)

// Bar-Öffnungszeiten — muss zu "FESTIVAL ZEITEN" in InfoScreen.jsx passen
// (Einlass Festivalgelände bis Ende/00:00, an beiden Tagen). Tageswoche statt
// Kalenderdatum, damit der Testmodus (echter Testlauf 2 Wochen vorher, aber
// gleicher Wochentag) automatisch mitfunktioniert, ohne den Testmodus-Offset
// hier extra kennen zu müssen — win.ts kommt vom Server als echte Uhrzeit,
// und die liegt im Testlauf ebenfalls auf einem Freitag/Samstag.
function isBarOpenAt(date) {
  const day = date.getDay() // 5 = Freitag, 6 = Samstag
  const hour = date.getHours()
  if (day === 5) return hour >= 16
  if (day === 6) return hour >= 12
  return false
}

// Mitternacht nach `date` — der Schlusszeitpunkt der laufenden Bar-Sitzung.
function sessionCloseAt(date) {
  const close = new Date(date)
  close.setDate(close.getDate() + 1)
  close.setHours(0, 0, 0, 0)
  return close
}

// Nächster Bar-Öffnungszeitpunkt ab `date` (nur relevant, wenn die Bar bei
// `date` noch zu hat — Freitag vor 16 Uhr oder Samstag vor 12 Uhr). Gibt
// `null` zurück, wenn es keine weitere Öffnung mehr gibt (nach Samstagnacht).
function nextBarOpen(date) {
  const day = date.getDay()
  const hour = date.getHours()
  const openHour = day === 5 && hour < 16 ? 16 : day === 6 && hour < 12 ? 12 : null
  if (openHour === null) return null
  const opened = new Date(date)
  opened.setHours(openHour, 0, 0, 0)
  return opened
}

/**
 * Frist, bis zu der ein Gewinn eingelöst werden kann. Zwei Fälle:
 * - Gewinn gezogen während die Bar offen hat, aber das 30-Minuten-Fenster
 *   reicht über den Bar-Schluss hinaus (kurz vor Mitternacht, Freitag wie
 *   Samstag): Frist endet hart mit dem Schluss, keine Verlängerung auf den
 *   nächsten Tag — siehe isUrgentRedemption für den zugehörigen UI-Hinweis.
 * - Gewinn gezogen während einer Schließzeit (z.B. Samstagnacht/-vormittag
 *   vor 12 Uhr, wenn die Bar noch nicht wieder auf hat): Frist beginnt erst
 *   mit der nächsten Öffnung — siehe isDelayedRedemption. Gibt es keine
 *   nächste Öffnung mehr (nach Samstagnacht ist endgültig Schluss), ist die
 *   Frist sofort um.
 */
export function getRedemptionDeadline(ts) {
  const won = new Date(ts)

  if (isBarOpenAt(won)) {
    const naive = new Date(won.getTime() + PFEFFI_REDEMPTION_WINDOW_MS)
    return isBarOpenAt(naive) ? naive : sessionCloseAt(won)
  }

  const reopen = nextBarOpen(won)
  return reopen ? new Date(reopen.getTime() + PFEFFI_REDEMPTION_WINDOW_MS) : won
}

/**
 * True, wenn das Zeitfenster über den Bar-Schluss hinausreicht und die Frist
 * deshalb kürzer als die normalen 30 Minuten ausfällt — Signal für die UI,
 * statt der normalen Restzeit-Anzeige auf Eile hinzuweisen ("jetzt aber
 * schnell einlösen").
 */
export function isUrgentRedemption(ts) {
  const won = new Date(ts)
  if (!isBarOpenAt(won)) return false
  const naive = new Date(won.getTime() + PFEFFI_REDEMPTION_WINDOW_MS)
  return !isBarOpenAt(naive)
}

/**
 * True, wenn der Gewinn während einer Schließzeit gezogen wurde und die
 * Frist deshalb erst mit der nächsten Bar-Öffnung zu laufen beginnt —
 * Signal für einen Hinweis auf dem Gewinn-Ticket.
 */
export function isDelayedRedemption(ts) {
  return !isBarOpenAt(new Date(ts))
}

// Apps Script Web Apps haben einen bekannten "Cold Start" — die erste Anfrage
// nach einer Ruhephase kann mehrere Sekunden dauern. Nach REQUEST_TIMEOUT_MS
// brechen wir ab, statt die App unbegrenzt warten zu lassen.
const REQUEST_TIMEOUT_MS = 10000

const STORAGE_WIN_KEY = 'pfeffi_win'
const STORAGE_LAST_TRY_KEY = 'pfeffi_last_try'

/** Ist ein gespeicherter Gewinn über seine Einlösefrist hinaus? */
export function isWinExpired(win) {
  if (!win?.won || !win.ts) return false
  return Date.now() > getRedemptionDeadline(win.ts).getTime()
}

/** Liest einen bereits gespeicherten Gewinn aus localStorage (oder null). */
export function getStoredWin() {
  try {
    const raw = localStorage.getItem(STORAGE_WIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function storeWin(win) {
  try {
    localStorage.setItem(STORAGE_WIN_KEY, JSON.stringify(win))
  } catch {
    // localStorage nicht verfügbar (z.B. privater Modus) — Gewinn bleibt
    // trotzdem gültig, nur ohne Persistenz über einen Reload hinweg.
  }
}

function storeLastTry(ts) {
  try {
    localStorage.setItem(STORAGE_LAST_TRY_KEY, String(ts))
  } catch {
    // siehe storeWin()
  }
}

/** Verbleibende Cooldown-Zeit in ms bis zum nächsten erlaubten Versuch. */
export function getCooldownRemaining() {
  const raw = localStorage.getItem(STORAGE_LAST_TRY_KEY)
  const last = raw ? Number(raw) : null
  if (!last) return 0
  const remaining = PFEFFI_COOLDOWN_MS - (Date.now() - last)
  return remaining > 0 ? remaining : 0
}

/**
 * Schickt einen leichten, unkritischen Request an den Endpoint, sobald der
 * Glücks-Pfeffi-Screen geöffnet wird — hält die Apps-Script-Instanz warm,
 * damit der eigentliche Draw-Klick nicht den vollen Cold-Start abbekommt.
 * Fire-and-forget: Ergebnis/Fehler werden ignoriert.
 */
export function warmupPfeffi() {
  fetch(`${ENDPOINT_URL}?action=status`, { cache: 'no-store' }).catch(() => {})
}

/**
 * Fragt beim Apps-Script-Endpoint einen Gewinnversuch an.
 * Rückgabe: { won, ts } bei einer echten Antwort vom Server —
 * { won: false, error: true } bei Timeout/Netzwerkfehler (App bricht nicht
 * ab). Der Cooldown startet erst bei einer echten Antwort — ein Timeout oder
 * Netzwerkfehler verbraucht keinen Versuch, der Besucher darf sofort nochmal.
 */
export async function drawPfeffi() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${ENDPOINT_URL}?action=draw`, { cache: 'no-store', signal: controller.signal })
    if (!res.ok) throw new Error(`Pfeffi-Endpoint fehlgeschlagen: ${res.status}`)
    const data = await res.json()
    storeLastTry(Date.now())
    if (data.won) storeWin({ won: true, ts: data.ts })
    return data
  } catch (err) {
    console.warn('[pfeffi] Draw fehlgeschlagen:', err)
    return { won: false, error: true }
  } finally {
    clearTimeout(timeoutId)
  }
}
