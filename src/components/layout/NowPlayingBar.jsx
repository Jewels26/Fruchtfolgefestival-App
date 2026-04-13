import './NowPlayingBar.css'

// Später: echte Daten aus timetable data
const MOCK_NOW_PLAYING = {
  band: 'CULTIVATOR',
  stage: 'MAIN STAGE',
  time: '20:00',
}

// Zeigt die Bar nur während des Festivals (28.–30. August)
function isFestivalActive() {
  const now = new Date()
  const year = now.getFullYear()
  const start = new Date(year, 7, 28, 8, 0)   // 28. August 08:00
  const end   = new Date(year, 7, 30, 23, 59)  // 30. August 23:59
  return now >= start && now <= end
}

export default function NowPlayingBar() {
  if (!isFestivalActive()) return null

  const { band, stage, time } = MOCK_NOW_PLAYING

  return (
    <div className="now-playing-bar">
      <div className="now-playing-inner">
        <span className="pulse-dot" />
        <div className="now-playing-text">
          <span className="now-playing-label">NOW PLAYING</span>
          <span className="now-playing-band">{band}</span>
        </div>
        <div className="now-playing-meta">
          <span className="now-playing-stage">{stage}</span>
          <span className="now-playing-time">{time}</span>
        </div>
        <button className="now-playing-play" aria-label="Details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
