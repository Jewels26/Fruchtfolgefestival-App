// ─── PATRICK MATCHER — REGRESSIONSTEST ───
// Plain-Node-Skript (kein Testframework nötig). Läuft via:
//   node scripts/patrickMatcher.test.mjs
// oder: npm run test:patrick
//
// Prüft zwei Dinge:
// 1. Keyword-Kollisionen: zwei Response-Einträge, deren normalisiertes
//    Wort-Set identisch ist, konkurrieren bei jedem Treffer um denselben
//    Score — der spätere Eintrag ist dann für dieses Keyword unerreichbar,
//    weil bei Gleichstand immer der frühere gewinnt (siehe matchPatrick).
// 2. Konkretes Frage->Antwort-Verhalten für zuvor gefundene Bugs, neu
//    ergänzte Synonyme und die Wiederholungssperre bei Zufallsantworten.
//
// Lädt patrickMatcher.js NICHT direkt, weil das transitiv weatherStore.js
// importiert, das beim Modul-Load sofort einen echten Netzwerk-Fetch an
// open-meteo.com auslöst (Nebeneffekt, ungeeignet für einen Test). Stattdessen
// wird der Quelltext gelesen, der weatherStore-Import durch einen steuerbaren
// Stub ersetzt, und das Ergebnis als temporäre Kopie neben dem Original
// importiert (damit der relative LINEUP-Import weiter auflöst) und danach
// wieder gelöscht.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_UTILS = path.join(__dirname, '..', 'src', 'utils')
const MATCHER_PATH = path.join(SRC_UTILS, 'patrickMatcher.js')

let seq = 0

function patchSource(src, weatherDays) {
  const weatherImportPattern = /import\s*\{\s*getWeatherDays\s*\}\s*from\s*['"]\.\/weatherStore(?:\.js)?['"]/
  if (!weatherImportPattern.test(src)) {
    throw new Error('weatherStore-Import in patrickMatcher.js nicht gefunden — Test-Regex anpassen.')
  }
  let out = src.replace(
    weatherImportPattern,
    `function getWeatherDays() { return ${JSON.stringify(weatherDays ?? null)} }`
  )

  if (!out.includes('export const RESPONSES = [')) {
    if (!out.includes('const RESPONSES = [')) {
      throw new Error('RESPONSES-Deklaration in patrickMatcher.js nicht gefunden — Test-Regex anpassen.')
    }
    out = out.replace('const RESPONSES = [', 'export const RESPONSES = [')
  }
  if (!out.includes('export function normalize(')) {
    out = out.replace('function normalize(str) {', 'export function normalize(str) {')
  }
  if (!out.includes('export function wordsOf(')) {
    out = out.replace('function wordsOf(norm) {', 'export function wordsOf(norm) {')
  }
  return out
}

// weatherDays: null (kein Feed geladen, Normalfall) oder ein Array von
// Tagesobjekten im Shape, das describeWeatherDay() erwartet.
async function loadMatcher(weatherDays) {
  const src = fs.readFileSync(MATCHER_PATH, 'utf8')
  const patched = patchSource(src, weatherDays)
  const tempPath = path.join(SRC_UTILS, `__patrickMatcher.test.${process.pid}.${seq++}.mjs`)
  fs.writeFileSync(tempPath, patched)
  try {
    const url = 'file://' + tempPath.replace(/\\/g, '/')
    return await import(url)
  } finally {
    fs.rmSync(tempPath, { force: true })
  }
}

let passed = 0
let failed = 0
const failures = []

function check(label, condition) {
  if (condition) {
    passed++
  } else {
    failed++
    failures.push(label)
    console.error(`  FAIL  ${label}`)
  }
}

async function main() {
  // ─── 1. Kollisions-Audit ──────────────────────────────────────────────
  console.log('=== Keyword-Kollisionen ===')
  const { RESPONSES, normalize, wordsOf } = await loadMatcher(null)

  const sigMap = new Map()
  RESPONSES.forEach((r, i) => {
    r.keywords.forEach(kw => {
      const sig = [...wordsOf(normalize(kw))].sort().join('|')
      if (!sigMap.has(sig)) sigMap.set(sig, [])
      sigMap.get(sig).push(i)
    })
  })
  let collisions = 0
  for (const [sig, idxs] of sigMap) {
    const uniq = [...new Set(idxs)]
    if (uniq.length > 1) {
      collisions++
      console.error(`  FAIL  Keyword-Set "${sig}" gehört zu mehreren Einträgen: ${uniq.join(', ')}`)
    }
  }
  check('keine doppelt vergebenen Keyword-Sets', collisions === 0)

  // Hygiene: jeder Eintrag braucht text ODER eine nicht-leere texts-Liste
  const broken = RESPONSES
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => !r.text && !(Array.isArray(r.texts) && r.texts.length > 0))
  check('jeder Eintrag hat text oder texts', broken.length === 0)

  // ─── 2. Verhaltens-Regression (kein Wetter-Feed geladen) ──────────────
  console.log('\n=== Verhalten (Öffnungszeiten, Kollisions-Fixes, Synonyme) ===')
  const { matchPatrick, pickSuggestedQuestions } = await loadMatcher(null)

  const findEntry = predicate => RESPONSES.find(predicate)
  const oeffnungszeiten = findEntry(r => r.keywords.includes('wann fängt'))
  const gelaendeKarte = findEntry(r => r.keywords.includes('geländeplan'))
  const zahlenKarte = findEntry(r => r.keywords.includes('kartenzahlung'))
  const holzwurmTribut = findEntry(r => r.keywords.includes('holzwurm'))
  const deko = findEntry(r => r.keywords.includes('dekoration'))
  const kinder = findEntry(r => r.keywords.includes('kinderfreundlich'))
  const camping = findEntry(r => r.keywords.includes('zeltplatz'))
  const namensbedeutung = findEntry(r => r.keywords.includes('wieso heißt'))
  const trinken = findEntry(r => r.keywords.includes('alkohol'))

  for (const q of ["wann fängt's an?", "wann geht's los?", 'Wann startet das Festival?', 'wann ist der anfang']) {
    const r = matchPatrick(q)
    check(`"${q}" -> Öffnungszeiten`, r?.text === oeffnungszeiten.text)
  }

  check('"wo ist die karte" -> Gelände-Karte (nicht Zahlen)',
    gelaendeKarte.texts.includes(matchPatrick('wo ist die karte')?.text))
  check('"kann ich mit karte zahlen" -> Zahlen',
    matchPatrick('kann ich mit karte zahlen')?.text === zahlenKarte.text)
  check('"kartenzahlung möglich" -> Zahlen',
    matchPatrick('kartenzahlung möglich')?.text === zahlenKarte.text)

  check('"holzwurm" -> Easter-Egg-Tribut (nicht Deko)',
    holzwurmTribut.texts.includes(matchPatrick('holzwurm')?.text))
  check('"wer macht die deko" -> Deko',
    matchPatrick('wer macht die deko')?.text === deko.text)

  check('"ist das festival kinderfreundlich" -> Kinder',
    matchPatrick('ist das festival kinderfreundlich')?.text === kinder.text)
  check('"wo ist der zeltplatz" -> Camping',
    matchPatrick('wo ist der zeltplatz')?.text === camping.text)
  check('"wo ist der campingplatz" -> Camping',
    matchPatrick('wo ist der campingplatz')?.text === camping.text)
  check('"wieso heißt es fruchtfolge festival" -> Namensbedeutung',
    matchPatrick('wieso heißt es fruchtfolge festival')?.text === namensbedeutung.text)
  check('"ist alkohol erlaubt" -> Getränke',
    matchPatrick('ist alkohol erlaubt')?.text === trinken.text)

  // pickSuggestedQuestions(999) gibt den kompletten Pool zurück (count > Pool-Größe
  // bricht die Schleife einfach früher ab) — so testen wir jede Frage im Pool, nicht
  // nur eine zufällige 4er-Stichprobe.
  const allSuggested = pickSuggestedQuestions(999)
  check('Vorschlagsfragen-Pool hat mehr als 4 Fragen (sonst keine Varianz)',
    allSuggested.length > 4)
  check('jede Frage im Vorschlagsfragen-Pool liefert eine Antwort',
    allSuggested.every(q => matchPatrick(q) !== null))

  for (const q of ['', '   ', '???', 'asdkjaslkdj']) {
    check(`"${q}" -> null, kein Crash`, matchPatrick(q) === null)
  }

  // ─── 3. Wetter (mit injiziertem Feed) ──────────────────────────────────
  console.log('\n=== Wetter-Synonyme ===')
  const fixtureDay = { dayName: 'TestFreitag', temp: 28, rain: 10, condition: 'sonnig', icon: '☀️' }
  const { matchPatrick: matchWithWeather } = await loadMatcher([fixtureDay])

  check('"regnet es morgen" matcht mit geladenem Wetter-Feed',
    matchWithWeather('regnet es morgen')?.text.includes('TestFreitag'))
  check('"regnet es morgen" -> null ohne geladenen Wetter-Feed (fällt nirgends sonst rein)',
    matchPatrick('regnet es morgen') === null)

  // ─── 4. Wiederholungssperre ────────────────────────────────────────────
  console.log('\n=== Wiederholungssperre bei Zufallsantworten ===')

  function noImmediateRepeat(fn, rounds = 40) {
    let prev = null
    for (let i = 0; i < rounds; i++) {
      const cur = fn()
      if (cur !== null && cur === prev) return false
      prev = cur
    }
    return true
  }

  const servusEntry = findEntry(r => r.keywords.includes('servus'))
  check('texts-Array (z.B. "servus") wiederholt sich nie direkt',
    servusEntry.texts.length > 1 && noImmediateRepeat(() => matchPatrick('servus')?.text))

  check('Band-Zeit-Varianten ("wann spielt poolhead") wiederholen sich nie direkt',
    noImmediateRepeat(() => matchPatrick('wann spielt poolhead')?.text))

  check('Wetter-Varianten wiederholen sich nie direkt',
    noImmediateRepeat(() => matchWithWeather('wetter')?.text))

  // ─── Ergebnis ───────────────────────────────────────────────────────────
  console.log(`\n${passed} OK, ${failed} FAIL`)
  if (failed > 0) {
    console.error('\nFehlgeschlagen:')
    failures.forEach(f => console.error(`  - ${f}`))
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error('Test-Skript abgebrochen:', err)
  process.exitCode = 1
})
