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

// Apps Script Web Apps haben einen bekannten "Cold Start" — die erste Anfrage
// nach einer Ruhephase kann mehrere Sekunden dauern. Nach REQUEST_TIMEOUT_MS
// brechen wir ab, statt die App unbegrenzt warten zu lassen.
const REQUEST_TIMEOUT_MS = 10000

const STORAGE_WIN_KEY = 'pfeffi_win'
const STORAGE_LAST_TRY_KEY = 'pfeffi_last_try'

/** Ist ein gespeicherter Gewinn älter als das Einlöse-Zeitfenster? */
export function isWinExpired(win) {
  if (!win?.won || !win.ts) return false
  return Date.now() - new Date(win.ts).getTime() > PFEFFI_REDEMPTION_WINDOW_MS
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
