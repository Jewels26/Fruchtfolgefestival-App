import { useState, useEffect } from 'react'
import { isTestMode } from './festivalConfig'

const LAT = 48.20
const LON = 11.27

// Echte Festivaltage vs. Testwochenende (siehe festivalConfig.js) — bei
// Testmodus zeigt die Wetterkarte die kurzfristig zuverlässige Vorhersage
// fürs echte Testwochenende statt einer 14 Tage vorausgesagten (kaum
// belastbaren) Prognose für die echten Festivaltage.
const DATE_RANGES = {
  festival: {
    start: '2026-08-28', end: '2026-08-29',
    labels: {
      '2026-08-28': ['FR 28.8.', 'Freitag'],
      '2026-08-29': ['SA 29.8.', 'Samstag'],
    },
  },
  test: {
    start: '2026-08-14', end: '2026-08-15',
    labels: {
      '2026-08-14': ['FR 14.8.', 'Freitag'],
      '2026-08-15': ['SA 15.8.', 'Samstag'],
    },
  },
}

function wmoToDisplay(code) {
  if (code === 0)  return { condition: 'sonnig',         icon: '☀️' }
  if (code <= 2)   return { condition: 'leicht bewölkt', icon: '🌤️' }
  if (code === 3)  return { condition: 'bewölkt',         icon: '☁️' }
  if (code <= 48)  return { condition: 'nebelig',         icon: '🌫️' }
  if (code <= 55)  return { condition: 'nieselregen',     icon: '🌦️' }
  if (code <= 65)  return { condition: 'regen',           icon: '🌧️' }
  if (code <= 77)  return { condition: 'schnee',          icon: '❄️' }
  if (code <= 82)  return { condition: 'schauer',         icon: '🌧️' }
  return                  { condition: 'gewitter',        icon: '⛈️' }
}

// ─── Shared module-level cache ───
let cache = null
let cachedForTestMode = null
const listeners = new Set()

function notify() {
  for (const cb of listeners) cb(cache)
}

function fetchWeather() {
  const testMode = isTestMode()
  cachedForTestMode = testMode
  const range = testMode ? DATE_RANGES.test : DATE_RANGES.festival

  fetch(
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LAT}&longitude=${LON}` +
    `&daily=temperature_2m_max,precipitation_probability_max,windspeed_10m_max,weathercode` +
    `&timezone=Europe%2FBerlin` +
    `&start_date=${range.start}&end_date=${range.end}`
  )
    .then(r => r.json())
    .then(data => {
      const times = data?.daily?.time
      if (!times?.length) return
      cache = times.map((date, i) => {
        const [label, dayName] = range.labels[date] ?? [date, '']
        return {
          date,
          label,
          dayName,
          temp: Math.round(data.daily.temperature_2m_max[i]),
          rain: data.daily.precipitation_probability_max[i] ?? 0,
          wind: Math.round(data.daily.windspeed_10m_max[i]),
          ...wmoToDisplay(data.daily.weathercode[i]),
        }
      })
      notify()
    })
    .catch(() => {})
}

// Start fetch immediately when module is first imported
fetchWeather()

// Testmodus kann sich zur Laufzeit ändern (Sheet-Flag, siehe festivalConfig.js)
// — neu abfragen, sobald sich der Modus tatsächlich geändert hat.
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (isTestMode() !== cachedForTestMode) fetchWeather()
  }, 60 * 1000)
}

// Synchronous read — returns null until fetch resolves
export function getWeatherDays() {
  return cache
}

// React hook — re-renders when data arrives oder bei Testmodus-Wechsel neu abgefragt wird
export function useWeather() {
  const [days, setDays] = useState(() => cache)
  useEffect(() => {
    const cb = data => setDays(data)
    listeners.add(cb)
    return () => listeners.delete(cb)
  }, [])
  return days
}
