// ─── ESSEN & GETRÄNKE — Google Sheets als Backend ───
// Veranstalter pflegen Preise/Verfügbarkeit im Sheet-Tab "Essen".
// Zeilen mit gleichem Name + gleicher Verfügbarkeit werden zu einem
// Menüpunkt zusammengefasst, die Tags dabei vereinigt. Weicht die
// Verfügbarkeit einer Tag-Variante ab (z. B. Vegan aus, Fleisch an),
// bleiben es zwei getrennte Einträge mit demselben Namen.

const SHEET_ID = '1lWX0SjkC4ABSQRJPEAcpqm9bGzGZaM9sbouZeTt5PNM'
const SHEET_NAME = 'Essen'

export const ESSEN_POLL_INTERVAL = 2 * 60 * 1000 // 2 Minuten

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`

const TAG_ORDER = ['FLEISCH', 'VEGGIE', 'VEGAN']

// Kalkulationstabelle nennt Varianten z. B. "Bratwurstsemmel Schwein" /
// "Bratwurstsemmel Vegan" — dieses letzte Wort fällt für den Anzeigenamen weg,
// die Einordnung übernimmt ohnehin die Tags-Spalte.
const VARIANT_SUFFIXES = ['schwein', 'rind', 'huhn', 'pute', 'fleisch', 'vegan', 'veggie', 'vegetarisch']

function baseName(rawName) {
  const words = rawName.trim().split(/\s+/)
  const last = words[words.length - 1]?.toLowerCase()
  if (words.length > 1 && VARIANT_SUFFIXES.includes(last)) {
    return words.slice(0, -1).join(' ')
  }
  return rawName.trim()
}

/**
 * Lädt und gruppiert die Essen/Getränke-Daten aus dem Google Sheet.
 * Rückgabe: { [stand]: [{ id, name, price, tags, available }] }
 * Bei Fehler: leeres Objekt (App bricht nicht ab, Fallback-Daten bleiben sichtbar).
 */
export async function fetchEssen() {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
    const text = await res.text()
    return groupByStand(parseCSV(text))
  } catch (err) {
    console.warn('[essen] Fetch fehlgeschlagen:', err)
    return {}
  }
}

function groupByStand(rows) {
  // Gruppenschlüssel: Stand + Name + Verfügbarkeit
  const groups = new Map()

  for (const row of rows) {
    const stand = row.stand?.trim()
    const name = baseName(row.name || '')
    if (!stand || !name) continue

    const available = row['verfügbarkeit']?.trim().toLowerCase() !== 'aus'
    const key = `${stand}||${name}||${available}`

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        name,
        price: parsePrice(row.preis),
        tags: new Set(),
        available,
        stand,
      })
    }
    const group = groups.get(key)
    for (const tag of (row.tags || '').split(',')) {
      const t = tag.trim().toUpperCase()
      if (!t) continue
      // "Spendenbasis" landet manchmal in der Tags- statt der Preis-Spalte —
      // dann trotzdem als Preis behandeln statt als Ernährungs-Tag zu verwerfen.
      if (/SPENDE/.test(t)) {
        if (group.price == null) group.price = 'Spendenbasis'
      } else {
        group.tags.add(t)
      }
    }
  }

  const byStand = {}
  for (const group of groups.values()) {
    const item = {
      id: group.id,
      name: group.name,
      price: group.price,
      available: group.available,
      tags: TAG_ORDER.filter(t => group.tags.has(t)),
    }
    ;(byStand[group.stand] ||= []).push(item)
  }
  return byStand
}

function parsePrice(raw) {
  if (!raw) return null
  if (/spende/i.test(raw)) return 'Spendenbasis'
  const n = parseFloat(raw.replace(/[^\d,.-]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export function formatPrice(price) {
  if (price == null) return null
  if (typeof price === 'string') return price
  return price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
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
    .filter(row => row.id && row.name)
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
