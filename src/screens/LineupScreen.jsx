import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LINEUP, DAYS } from '../data/lineup'
import { asset } from '../utils/assetPath'
import './LineupScreen.css'

// ─── HERO CARD ───
function ArtistCard({ band }) {
  return (
    <div id={band.id} className={`artist-card card ${band.secret ? 'artist-card--secret' : ''}`}>

      {/* Foto-Bereich */}
      <div className="artist-photo">
        {band.photo ? (
          <img src={asset(band.photo)} alt={band.name} className="artist-photo-img" loading="lazy" decoding="async" />
        ) : (
          <div className="artist-photo-placeholder">
            {band.secret
              ? <span className="artist-secret-icon">?</span>
              : <span className="artist-photo-icon">♪</span>
            }
          </div>
        )}

        {/* Zeit Badge oben links */}
        <span className="artist-time-badge">{band.time}</span>

        {/* Bandname unten im Bild */}
        <div className="artist-name-overlay">
          <h2 className="artist-name">
            {band.secret ? '??? LATE NIGHT SPECIAL' : band.name}
          </h2>
        </div>
      </div>

      {/* Info-Bereich */}
      <div className="artist-info">
        <div className="artist-info-top">
          <div className="artist-meta">
            <div className="artist-details">
              {band.lateNight && (
                <span className="late-night-label">LATE NIGHT SPECIAL</span>
              )}
              <div className="artist-badges">
                {band.genre && band.genre !== 'tbd.' && (
                  <span className="badge">{band.genre}</span>
                )}
                {band.genre === 'tbd.' && (
                  <span className="badge badge--tbd">offen.</span>
                )}
                {band.origin && (
                  <span className="badge badge--origin">{band.origin}</span>
                )}
                {band.secret && (
                  <span className="badge badge--secret">ÜBERRASCHUNG</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── MAIN SCREEN ───
export default function LineupScreen() {
  const [searchParams] = useSearchParams()
  const dayParam = searchParams.get('day')?.toUpperCase()
  const bandParam = searchParams.get('band')

  const [activeDay, setActiveDay] = useState(
    LINEUP[dayParam] ? dayParam : 'FRI'
  )
  const bands = LINEUP[activeDay]

  useEffect(() => {
    if (!bandParam) return
    const el = document.getElementById(bandParam)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [bandParam, activeDay])

  return (
    <div className="screen lineup-screen fade-in">

      <h1 className="screen-title">LINEUP</h1>
      <div className="screen-title-underline" />

      {/* Day Selector */}
      <div className="day-selector">
        {DAYS.map(day => (
          <button
            key={day.key}
            className={`day-btn ${activeDay === day.key ? 'day-btn--active' : ''}`}
            onClick={() => setActiveDay(day.key)}
          >
            <span className="day-btn-label">{day.label}</span>
            <span className="day-btn-date">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Band Cards */}
      <div className="artist-list">
        {bands.map(band => (
          <ArtistCard key={band.id} band={band} />
        ))}
      </div>

    </div>
  )
}
