import { useState, useEffect } from 'react'
import { LINEUP } from '../../data/lineup'
import { usePatrick } from '../../context/PatrickContext'
import { getRandomPlayMessage } from '../ui/Patrick'
import './NowPlayingBar.css'

const FESTIVAL_DATES = { FRI: '2026-08-28', SAT: '2026-08-29' }

function getAllBands() {
  return Object.entries(LINEUP).flatMap(([day, bands]) =>
    bands.map((b, i) => {
      const start = new Date(`${FESTIVAL_DATES[day]}T${b.time}:00`)
      const next = bands[i + 1]
      const end = next
        ? new Date(`${FESTIVAL_DATES[day]}T${next.time}:00`)
        : new Date(start.getTime() + 90 * 60 * 1000)
      return { ...b, day, start, end }
    })
  )
}

function getNowPlaying() {
  const now = new Date()
  const bands = getAllBands()
  return bands.find(b => now >= b.start && now < b.end) || null
}

function isFestivalActive() {
  const now = new Date()
  const year = now.getFullYear()
  const start = new Date(year, 7, 28, 8, 0)
  const end   = new Date(year, 7, 30, 23, 59)
  return now >= start && now <= end
}

export default function NowPlayingBar() {
  const [nowPlaying, setNowPlaying] = useState(getNowPlaying)
  const { triggerPatrick } = usePatrick()

  useEffect(() => {
    const interval = setInterval(() => {
      setNowPlaying(getNowPlaying())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!isFestivalActive()) return null
  if (!nowPlaying) return null

  function handlePlayClick() {
    triggerPatrick(getRandomPlayMessage(nowPlaying.name))
  }

  return (
    <div className="now-playing-bar">
      <div className="now-playing-inner">
        <span className="pulse-dot" />
        <div className="now-playing-text">
          <span className="now-playing-label">LÄUFT GERADE</span>
          <span className="now-playing-band">{nowPlaying.name}</span>
        </div>
        <div className="now-playing-meta">
          <span className="now-playing-stage">HAUPTBÜHNE</span>
          <span className="now-playing-time">{nowPlaying.time}</span>
        </div>
        <button className="now-playing-play" aria-label="Details" onClick={handlePlayClick}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
