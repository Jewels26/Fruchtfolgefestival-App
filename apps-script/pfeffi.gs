// ─── GLÜCKS-PFEFFI — Apps Script Backend ───
// Quelltext zum Copy-Paste nach script.google.com (Standalone-Projekt).
// Setup-Anleitung: Docs/Docs/FFF_App_Handover.md, Abschnitt
// "Google Apps Script Backend (Glücks-Pfeffi)".
//
// Erwartet ein Google Sheet mit zwei Tabs:
//   "Pfeffi"      — Config + Zähler als Key/Value-Zeilen (Spalte A = Label, B = Wert)
//   "Pfeffi_Log"  — Audit-Log, wird nur angehängt (append), Header in Zeile 1
//
// Sheet-Struktur "Pfeffi" (Reihenfolge egal, Script sucht per Label):
//   total_limit      100
//   total_issued     0
//   hour_slot        (leer lassen — wird automatisch befüllt)
//   hour_issued      0
//   hour_budget      0
//   base_chance      0.25
//   reduced_chance   0.05
//   festival_start   2026-08-28T16:00:00
//   festival_end     2026-08-30T11:00:00
//   updated_at       (leer lassen)

const SHEET_ID = '1lWX0SjkC4ABSQRJPEAcpqm9bGzGZaM9sbouZeTt5PNM' // gleiche Spreadsheet-ID wie announcements.js/essen.js
const CONFIG_TAB = 'Pfeffi'
const LOG_TAB = 'Pfeffi_Log'

function doGet(e) {
  const action = e.parameter.action

  if (action === 'draw') {
    return jsonResponse(handleDraw_())
  }
  if (action === 'status') {
    return jsonResponse(handleStatus_())
  }
  return jsonResponse({ error: 'unknown action' })
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

// ─── Config lesen/schreiben (Key/Value-Zeilen, Spalte A = Label) ───

function readConfig_(sheet) {
  const values = sheet.getDataRange().getValues()
  const config = {}
  const rowByLabel = {}
  for (let i = 0; i < values.length; i++) {
    const label = String(values[i][0] || '').trim()
    if (!label) continue
    config[label] = values[i][1]
    rowByLabel[label] = i + 1 // 1-indiziert für getRange
  }
  return { config, rowByLabel }
}

function writeConfig_(sheet, rowByLabel, updates) {
  for (const label in updates) {
    const row = rowByLabel[label]
    if (row) sheet.getRange(row, 2).setValue(updates[label])
  }
}

function parseDate_(value) {
  return value instanceof Date ? value : new Date(value)
}

// ─── Draw-Logik ───

function handleDraw_() {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID)
    const sheet = ss.getSheetByName(CONFIG_TAB)
    const { config, rowByLabel } = readConfig_(sheet)

    const now = new Date()
    const festivalStart = parseDate_(config.festival_start)
    const festivalEnd = parseDate_(config.festival_end)

    if (now < festivalStart) {
      appendLog_(ss, now, false, 'not_started', config)
      return { won: false, reason: 'not_started' }
    }
    if (now > festivalEnd) {
      appendLog_(ss, now, false, 'festival_over', config)
      return { won: false, reason: 'festival_over' }
    }

    const totalLimit = Number(config.total_limit)
    let totalIssued = Number(config.total_issued) || 0
    let hourSlot = config.hour_slot === '' || config.hour_slot == null ? null : Number(config.hour_slot)
    let hourIssued = Number(config.hour_issued) || 0
    let hourBudget = Number(config.hour_budget) || 0
    const baseChance = Number(config.base_chance)
    const reducedChance = Number(config.reduced_chance)

    // Aktuellen Stunden-Slot bestimmen (Stunden seit Festivalstart)
    const currentSlot = Math.floor((now - festivalStart) / 3600000)

    if (hourSlot !== currentSlot) {
      // Neue Stunde: Rest-Kontingent auf die verbleibenden Stunden verteilen
      const totalRemaining = Math.max(0, totalLimit - totalIssued)
      const hoursRemaining = Math.max(1, Math.ceil((festivalEnd - now) / 3600000))
      hourBudget = Math.round(totalRemaining / hoursRemaining)
      hourIssued = 0
      hourSlot = currentSlot
    }

    const totalRemaining = totalLimit - totalIssued
    let won = false

    if (totalRemaining > 0) {
      const hourRemaining = hourBudget - hourIssued
      const chance = hourRemaining > 0 ? baseChance : reducedChance
      won = Math.random() < chance
      if (won) {
        totalIssued += 1
        hourIssued += 1
      }
    }

    writeConfig_(sheet, rowByLabel, {
      total_issued: totalIssued,
      hour_slot: hourSlot,
      hour_issued: hourIssued,
      hour_budget: hourBudget,
      updated_at: now,
    })

    appendLog_(ss, now, won, won ? 'win' : 'lose', {
      total_issued: totalIssued,
      hour_issued: hourIssued,
      hour_budget: hourBudget,
    })

    return { won, ts: now.toISOString() }
  } finally {
    lock.releaseLock()
  }
}

function handleStatus_() {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName(CONFIG_TAB)
  const { config } = readConfig_(sheet)
  return {
    total_limit: Number(config.total_limit),
    total_issued: Number(config.total_issued) || 0,
    hour_slot: config.hour_slot,
    hour_issued: Number(config.hour_issued) || 0,
    hour_budget: Number(config.hour_budget) || 0,
  }
}

function appendLog_(ss, now, won, reason, extra) {
  const logSheet = ss.getSheetByName(LOG_TAB)
  if (!logSheet) return
  logSheet.appendRow([
    now,
    won,
    reason,
    extra.total_issued ?? '',
    extra.hour_issued ?? '',
    extra.hour_budget ?? '',
  ])
}
