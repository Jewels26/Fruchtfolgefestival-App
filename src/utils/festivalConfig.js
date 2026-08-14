// ─── FESTIVAL-ZEITRAUM — zentrale Quelle ───
// Wird von HomeScreen (Countdown) und GluecksPfeffiScreen (Festival-Fenster
// für Glücks-Pfeffi) gemeinsam genutzt. Muss zu festival_start/festival_end
// im Pfeffi-Sheet passen (siehe apps-script/pfeffi.gs).
export const FESTIVAL_CONFIG = {
  year: 2026,
  est: 2025,
  gatesOpen:   new Date(2026, 7, 28, 16, 0, 0),
  festivalEnd: new Date(2026, 7, 30, 11, 0, 0),
}

// ─── TEST-MODUS ───
// Fürs Helferteam vorab testbar machen, obwohl das echte Festival noch nicht
// läuft — ohne dass jemand einen neuen Link/App-Stand installieren muss.
// Steuerung läuft über eine Zeile in einem eigenen Google-Sheet-Tab
// ("Testmodus", Zeile "test_mode" = TRUE/FALSE als Checkbox), den die App
// per öffentlichem CSV-Export pollt (gleicher Mechanismus wie Ankündigungen/
// Essen, siehe announcements.js) — kein Apps-Script-Deployment nötig.
// Sobald aktiv, tut getNow() so, als wäre DIESES Wochenende das Festival-
// Wochenende — Countdown, "Jetzt läuft" & Patricks Sprüche laufen dadurch
// ganz natürlich in Echtzeit. Funktioniert nur, weil der Testlauf exakt
// zwei Wochen (= gleicher Wochentag) vor dem echten Festival stattfindet;
// bei Bedarf TEST_WEEKEND_ANCHOR anpassen.
// getNow() ist die einzige Stelle, die "aktuelle Zeit" kennen soll — alle
// zeitabhängigen Features rufen sie statt new Date() auf.

// Fr 14.8.2026, 16 Uhr — Start des Testlaufs, exakt 2 Wochen vor gatesOpen.
const TEST_WEEKEND_ANCHOR = new Date(2026, 7, 14, 16, 0, 0)
const TEST_MODE_OFFSET_MS = FESTIVAL_CONFIG.gatesOpen.getTime() - TEST_WEEKEND_ANCHOR.getTime()

const REMOTE_FLAG_SHEET_ID = '1lWX0SjkC4ABSQRJPEAcpqm9bGzGZaM9sbouZeTt5PNM' // gleiches Sheet wie announcements.js/pfeffi.gs
const REMOTE_FLAG_TAB = 'Testmodus'
const REMOTE_FLAG_ROW_LABEL = 'test_mode'
const REMOTE_FLAG_POLL_MS = 60 * 1000 // 1 Minute
const REMOTE_FLAG_CACHE_KEY = 'fff_testmodus_cache'

const REMOTE_FLAG_CSV_URL =
  `https://docs.google.com/spreadsheets/d/${REMOTE_FLAG_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(REMOTE_FLAG_TAB)}`

const TRUTHY_VALUES = new Set(['TRUE', 'WAHR', '1', 'JA']) // Sheets-Locale kann DE oder EN sein

let testModeActive = typeof window !== 'undefined' && localStorage.getItem(REMOTE_FLAG_CACHE_KEY) === '1'

function setTestModeActive(active) {
  testModeActive = active
  if (typeof window !== 'undefined') {
    localStorage.setItem(REMOTE_FLAG_CACHE_KEY, active ? '1' : '0')
  }
}

/** Parst die Key/Value-Zeilen (Spalte A = Label, B = Wert) des Testmodus-Tabs. */
function parseFlagCSV(text) {
  for (const line of text.split(/\r?\n/)) {
    const [rawLabel, rawValue] = line.split(',')
    const label = (rawLabel || '').trim().replace(/^"|"$/g, '')
    if (label.toLowerCase() !== REMOTE_FLAG_ROW_LABEL) continue
    const value = (rawValue || '').trim().replace(/^"|"$/g, '').toUpperCase()
    return TRUTHY_VALUES.has(value)
  }
  return false
}

async function pollRemoteTestMode() {
  try {
    const res = await fetch(REMOTE_FLAG_CSV_URL, { cache: 'no-store' })
    if (!res.ok) return
    setTestModeActive(parseFlagCSV(await res.text()))
  } catch {
    // Netzwerkfehler: letzten bekannten Stand (localStorage) beibehalten
  }
}

if (typeof window !== 'undefined') {
  pollRemoteTestMode()
  setInterval(pollRemoteTestMode, REMOTE_FLAG_POLL_MS)
}

export function isTestMode() {
  return testModeActive
}

export function getNow() {
  if (!isTestMode()) return new Date()
  return new Date(Date.now() + TEST_MODE_OFFSET_MS)
}
