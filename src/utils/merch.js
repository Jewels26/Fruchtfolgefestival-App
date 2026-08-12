// ─── MERCH — Google Sheets als Backend ───
// Veranstalter pflegen Größen/Preise/Ausverkauft-Status im Sheet-Tab "Merch".
// Spalten (fix per Position, nicht per Name — Hoodie und Shirt haben beide
// eine Spalte "Ausverkauft", die Namen sind also nicht eindeutig):
//   A Groessen Hoodie | B Preis Hoodie | C Ausverkauft
//   D Groessen Shirt  | E Preis Shirt  | F Ausverkauft

const SHEET_ID = '1lWX0SjkC4ABSQRJPEAcpqm9bGzGZaM9sbouZeTt5PNM'
const SHEET_NAME = 'Merch'

export const MERCH_POLL_INTERVAL = 2 * 60 * 1000 // 2 Minuten

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`

/**
 * Lädt Größen/Preise/Ausverkauft-Status aus dem Google Sheet.
 * Rückgabe: { hoodie: [{ size, price, soldOut }], shirt: [{ size, price, soldOut }] }
 * Bei Fehler: leere Listen (App bricht nicht ab, Fallback-Daten bleiben sichtbar).
 */
export async function fetchMerch() {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
    const text = await res.text()
    return parseMerch(parseRows(text))
  } catch (err) {
    console.warn('[merch] Fetch fehlgeschlagen:', err)
    return { hoodie: [], shirt: [] }
  }
}

function parseMerch(rows) {
  const hoodie = []
  const shirt = []

  for (const row of rows.slice(1)) {
    const [hoodieSize, hoodiePrice, hoodieSoldOut, shirtSize, shirtPrice, shirtSoldOut] = row

    if (hoodieSize?.trim()) {
      hoodie.push({
        size: hoodieSize.trim(),
        price: parsePrice(hoodiePrice),
        soldOut: Boolean(hoodieSoldOut?.trim()),
      })
    }
    if (shirtSize?.trim()) {
      shirt.push({
        size: shirtSize.trim(),
        price: parsePrice(shirtPrice),
        soldOut: Boolean(shirtSoldOut?.trim()),
      })
    }
  }

  return { hoodie, shirt }
}

function parsePrice(raw) {
  if (!raw) return null
  const n = parseFloat(raw.replace(/[^\d,.-]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
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
