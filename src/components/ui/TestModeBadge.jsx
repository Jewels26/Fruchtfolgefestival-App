import { useState, useEffect } from 'react'
import { isTestMode, getNow } from '../../utils/festivalConfig'
import './TestModeBadge.css'

export default function TestModeBadge() {
  const [active, setActive] = useState(isTestMode)
  const [now, setNow] = useState(getNow)

  // Das Testmodus-Flag kommt per Sheet-Polling von außen (siehe festivalConfig.js)
  // und kann sich jederzeit ändern — deshalb hier laufend neu prüfen statt nur beim Mount.
  useEffect(() => {
    const id = setInterval(() => {
      setActive(isTestMode())
      setNow(getNow())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  if (!active) return null

  const label = now.toLocaleString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <div className="test-mode-badge">
      🧪 TESTMODUS · simulierte Zeit {label}
    </div>
  )
}
