import { useState } from 'react'
import { LINEUP, DAYS } from '../data/lineup'
import './LineupScreen.css'

// ─── FAVORITES HOOK (localStorage) ───
function useFavorites() {
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fff-favs') || '[]') }
    catch { return [] }
  })
  const toggle = (id) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('fff-favs', JSON.stringify(next))
      return next
    })
  }
  return [favs, toggle]
}

// ─── HERO CARD ───
function ArtistCard({ band, isFav, onToggleFav }) {
  return (
    <div className={`artist-card card ${band.secret ? 'artist-card--secret' : ''}`}>

      {/* Foto-Bereich */}
      <div className="artist-photo">
        {band.photo ? (
          <img src={band.photo} alt={band.name} className="artist-photo-img" />
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

      {/* Info-Bereich — nur noch Badges + Favorit */}
      <div className="artist-info">
        <div className="artist-info-top">
          <div className="artist-meta">
            <div className="artist-details">
              {band.lateNight && (
                <span className="late-night-label">LATE NIGHT SPECIAL · </span>
              )}
              <div className="artist-badges">
                {band.genre && band.genre !== 'tbd.' && (
                  <span className="badge">{band.genre}</span>
                )}
                {band.genre === 'tbd.' && (
                  <span className="badge badge--tbd">tbd.</span>
                )}
                {band.origin && (
                  <span className="badge badge--origin">{band.origin}</span>
                )}
                {band.secret && (
                  <span className="badge badge--secret">SURPRISE</span>
                )}
              </div>
            </div>
          </div>

          {/* Favoriten-Herz */}
          {!band.secret && (
            <button
              className={`fav-btn ${isFav ? 'fav-btn--active' : ''}`}
              onClick={() => onToggleFav(band.id)}
              aria-label={isFav ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
            >
              {isFav ? '♥' : '♡'}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}

// ─── MAIN SCREEN ───
export default function LineupScreen() {
  const [activeDay, setActiveDay] = useState('FRI')
  const [favs, toggleFav] = useFavorites()
  const bands = LINEUP[activeDay]

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
          <ArtistCard
            key={band.id}
            band={band}
            isFav={favs.includes(band.id)}
            onToggleFav={toggleFav}
          />
        ))}
      </div>

    </div>
  )
}
