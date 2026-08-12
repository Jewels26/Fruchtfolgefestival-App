import { useState, useEffect } from 'react'

const LAT = 48.20
const LON = 11.27

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
const listeners = new Set()

function notify() {
  for (const cb of listeners) cb(cache)
}

// Start fetch immediately when module is first imported
fetch(
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&daily=temperature_2m_max,precipitation_probability_max,windspeed_10m_max,weathercode` +
  `&timezone=Europe%2FBerlin` +
  `&start_date=2026-08-28&end_date=2026-08-29`
)
  .then(r => r.json())
  .then(data => {
    const times = data?.daily?.time
    if (!times?.length) return
    cache = times.map((date, i) => ({
      date,
      label: date === '2026-08-28' ? 'FR 28.8.' : 'SA 29.8.',
      dayName: date === '2026-08-28' ? 'Freitag' : 'Samstag',
      temp: Math.round(data.daily.temperature_2m_max[i]),
      rain: data.daily.precipitation_probability_max[i] ?? 0,
      wind: Math.round(data.daily.windspeed_10m_max[i]),
      ...wmoToDisplay(data.daily.weathercode[i]),
    }))
    notify()
  })
  .catch(() => {})

// Synchronous read — returns null until fetch resolves
export function getWeatherDays() {
  return cache
}

// React hook — re-renders when data arrives
export function useWeather() {
  const [days, setDays] = useState(() => cache)
  useEffect(() => {
    if (cache) { setDays(cache); return }
    const cb = data => setDays(data)
    listeners.add(cb)
    return () => listeners.delete(cb)
  }, [])
  return days
}
