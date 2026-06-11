// ─── FUNDSACHEN — Google Sheets als Backend ───
// Veranstalter tragen Fundgegenstände in das Sheet "Fundsachen" ein.
// Die App pollt periodisch und zeigt sie im Info-Tab.

const SHEET_ID = '1lWX0SjkC4ABSQRJPEAcpqm9bGzGZaM9sbouZeTt5PNM'
const SHEET_NAME = 'Fundsachen'

export const FUNDSACHEN_POLL_INTERVAL = 2 * 60 * 1000 // 2 Minuten

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`

/**
 * Lädt Fundgegenstände aus dem Google Sheet.
 * Rückgabe: Array von { id, gegenstand, abholort, gefunden }
 * Bei Fehler: leeres Array.
 */
export async function fetchFundsachen() {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
    const text = await res.text()
    return parseCSV(text)
  } catch (err) {
    console.warn('[fundsachen] Fetch fehlgeschlagen:', err)
    return []
  }
}

function parseCSV(text) {
  const rows = parseRows(text)
  if (rows.length < 2) return []

  const headers = rows[0].map(h => h.trim().toLowerCase())

  return rows.slice(1)
    .map(values => {
      const obj = {}
      headers.forEach((h, i) => { obj[h] = (values[i] || '').trim() })
      return obj
    })
    .filter(row => row.id && row.gegenstand)
}

function parseRows(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++ }
      else if (c === '"') { inQuotes = false }
      else { field += c }
    } else {
      if (c === '"') { inQuotes = true }
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && next === '\n') i++
        row.push(field); rows.push(row); row = []; field = ''
      } else { field += c }
    }
  }

  if (field !== '' || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}
