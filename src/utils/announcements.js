// ─── ANNOUNCEMENTS — Google Sheets als Backend ───
// Veranstalter pflegen Ankündigungen in einem Google Sheet.
// Die App pollt periodisch und zeigt sie auf dem HomeScreen.
// Patrick reagiert auf neue Einträge (siehe Patrick.jsx).

const SHEET_ID = '1lWX0SjkC4ABSQRJPEAcpqm9bGzGZaM9sbouZeTt5PNM'
const SHEET_NAME = 'Tabellenblatt1'

// Wie oft die App das Sheet abruft
export const POLL_INTERVAL = 2 * 60 * 1000 // 2 Minuten

// gviz-Endpoint liefert CSV — funktioniert ohne API-Key bei "Jeder mit Link kann ansehen"
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`

/**
 * Lädt die aktuellen Ankündigungen aus dem Google Sheet.
 * Rückgabe: Array von { id, title, body, patrick }
 * Bei Fehler: leeres Array (App bricht nicht ab).
 */
export async function fetchAnnouncements() {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
    const text = await res.text()
    return parseCSV(text)
  } catch (err) {
    console.warn('[announcements] Fetch fehlgeschlagen:', err)
    return []
  }
}

/**
 * Parst CSV-Text in Objekt-Array.
 * Header-Zeile bestimmt die Keys.
 * Berücksichtigt Anführungszeichen und Kommas innerhalb von Werten.
 */
function parseCSV(text) {
  const rows = parseRows(text)
  if (rows.length < 2) return []

  const headers = rows[0].map(h => h.trim().toLowerCase())

  return rows.slice(1)
    .map(values => {
      const obj = {}
      headers.forEach((h, i) => {
        obj[h] = (values[i] || '').trim()
      })
      return obj
    })
    .filter(row => row.id && (row.title || row.body)) // leere Zeilen ignorieren
}

/**
 * Einfacher CSV-Parser der mit Anführungszeichen umgehen kann.
 * Behandelt: "text mit, komma", "text mit ""escaped"" quotes", mehrzeilige Felder.
 */
function parseRows(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"'
        i++
      } else if (c === '"') {
        inQuotes = false
      } else {
        field += c
      }
    } else {
      if (c === '"') {
        inQuotes = true
      } else if (c === ',') {
        row.push(field)
        field = ''
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && next === '\n') i++
        row.push(field)
        rows.push(row)
        row = []
        field = ''
      } else {
        field += c
      }
    }
  }

  // Letzte Zeile (falls keine abschließende Newline)
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}
