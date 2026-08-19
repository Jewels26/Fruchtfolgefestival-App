import { useState, useEffect } from 'react'
import { LINEUP } from '../../data/lineup'
import { usePatrick } from '../../context/usePatrick'
import { getRandomPlayMessage } from '../../utils/playMessages'
import { FESTIVAL_CONFIG, getNow } from '../../utils/festivalConfig'
import './NowPlayingBar.css'

const FESTIVAL_DATES = { FRI: '2026-08-28', SAT: '2026-08-29' }

function getAllBands() {
  return Object.entries(LINEUP).flatMap(([day, bands]) =>
    bands.map(b => {
      const start = new Date(`${FESTIVAL_DATES[day]}T${b.time}:00`)
      let end = new Date(`${FESTIVAL_DATES[day]}T${b.endTime}:00`)
      // Mad Mother (Samstag) endet erst nach Mitternacht — endTime "00:00" liegt
      // dann kalendarisch vor dem Start, muss also auf den nächsten Tag rollen.
      if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000)
      return { ...b, day, start, end }
    })
  )
}

function getNowPlaying() {
  const now = getNow()
  const bands = getAllBands()
  return bands.find(b => now >= b.start && now < b.end) || null
}

function isFestivalActive() {
  const now = getNow()
  return now >= FESTIVAL_CONFIG.gatesOpen && now <= FESTIVAL_CONFIG.festivalEnd
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
