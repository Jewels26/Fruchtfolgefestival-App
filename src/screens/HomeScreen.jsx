import { useState, useEffect } from 'react'
import './HomeScreen.css'

// ─── KONFIGURATION — hier anpassen wenn Organisatoren Daten liefern ───
const FESTIVAL_CONFIG = {
  year: 2026,
  est: 2025,
  gatesOpen:   new Date(2026, 8, 28, 14, 0, 0),   // 28. Aug 08:00
  festivalEnd: new Date(2026, 8, 30, 11, 0, 0),  // 30. Aug 23:59
}

// ─── MOCK DATA — ersetzen wenn echte Daten vorliegen ───
const MOCK_WEATHER = {
  temp: 24,
  condition: 'Humid',
  rain: 12,
  wind: 18,
  icon: '⛈',
}

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'CAMPGROUND ACCESS UPDATED',
    body: 'Early bird gate arrival moved to 06:00 AM Thursday. Metal spirits only.',
  },
  {
    id: 2,
    title: 'MYSTERY HEADLINER REVEAL',
    body: 'Check the lineup tab tonight at midnight for the final ritual summoning.',
  },
]

// ─── COUNTDOWN HOOK ───
function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now()
    if (diff <= 0) return null
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function getFestivalState() {
  const now = Date.now()
  if (now < FESTIVAL_CONFIG.gatesOpen)   return 'before'
  if (now <= FESTIVAL_CONFIG.festivalEnd) return 'during'
  return 'after'
}

// ─── SUBCOMPONENTS ───

function CountdownCard({ t }) {
  const pad = n => String(n).padStart(2, '0')
  return (
    <div className="card countdown-card">
      <span className="countdown-est">EST. {FESTIVAL_CONFIG.est}</span>
      <p className="countdown-label-top">UNTIL THE GATES OPEN</p>
      <div className="countdown-digits">
        {[['days','DAYS'],['hours','HRS'],['minutes','MIN'],['seconds','SEC']].map(([key, label], i) => (
          <>
            {i > 0 && <span key={`sep-${i}`} className="countdown-sep">:</span>}
            <div key={key} className="countdown-unit">
              <span className="countdown-num">{pad(t[key])}</span>
              <span className="countdown-unit-label">{label}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

function WeatherCard({ w }) {
  return (
    <div className="card weather-card">
      <p className="weather-forecast-label">FORECAST</p>
      <div className="weather-body">
        <div className="weather-left">
          <span className="weather-temp">{w.temp}°C</span>
          <span className="weather-condition">{w.condition.toUpperCase()}</span>
        </div>
        <div className="weather-right">
          <div className="weather-details">
            <span>RAIN: {w.rain}%</span>
            <span>WIND: {w.wind}KM/H</span>
          </div>
          <span className="weather-icon" role="img">{w.icon}</span>
        </div>
      </div>
    </div>
  )
}

function AnnouncementCard({ item }) {
  return (
    <div className="card announcement-card">
      <h3 className="announcement-title">{item.title}</h3>
      <p className="announcement-body">{item.body}</p>
    </div>
  )
}

// ─── MAIN SCREEN ───
export default function HomeScreen() {
  const state = getFestivalState()
  const t     = useCountdown(FESTIVAL_CONFIG.gatesOpen)

  return (
    <div className="screen home-screen fade-in">

      {/* ── Logo Hero ── */}
      <div className="home-logo-hero">
        {/* Sobald SVG vorhanden: <img src="/logo.svg" alt="Fruchtfolge Festival" className="home-logo-img" /> */}
        <img src="/logo.png" alt="Fruchtfolge Festival" className="home-logo-img" />
      </div>

      {/* ── Countdown / Festival State ── */}
      {state === 'before' && t && <CountdownCard t={t} />}
      {state === 'before' && !t && (
        <div className="card state-card">
          <p className="state-primary">DIE TORE SIND OFFEN 🤘</p>
        </div>
      )}
      {state === 'during' && (
        <div className="card state-card">
          <p className="state-primary">DAS FESTIVAL LÄUFT</p>
          <p className="state-secondary">28. – 30. AUGUST {FESTIVAL_CONFIG.year}</p>
        </div>
      )}
      {state === 'after' && (
        <div className="card state-card">
          <p className="state-primary" style={{color:'var(--color-heading)'}}>SEE YOU NEXT YEAR</p>
          <p className="state-secondary">DANKE FÜR ALLES 🌾</p>
        </div>
      )}

      {/* ── Wetter ── */}
      <WeatherCard w={MOCK_WEATHER} />

      {/* ── Announcements ── */}
      <div className="announcements-section">
        <div className="announcements-header">
          <span className="announcements-tag">ANNOUNCEMENTS</span>
        </div>
        {MOCK_ANNOUNCEMENTS.map(item => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  )
}
