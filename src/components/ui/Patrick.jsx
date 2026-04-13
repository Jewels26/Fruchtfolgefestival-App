import { useState, useEffect } from 'react'
import { LINEUP } from '../../data/lineup'
import './Patrick.css'

// ─── Alle Bands flach mit echtem Datum ───
const FESTIVAL_DATES = { FRI: '2026-08-28', SAT: '2026-08-29' }

function getAllBands() {
  return Object.entries(LINEUP).flatMap(([day, bands]) =>
    bands
      .filter(b => !b.secret)
      .map(b => {
        const [h, m] = b.time.split(':').map(Number)
        const date = new Date(`${FESTIVAL_DATES[day]}T${b.time}:00`)
        return { ...b, day, date }
      })
  )
}

// ─── Sprüche pro Trigger ───
const MESSAGES = {
  15: (name) => [
    `⚡ Noch 15 Minuten bis ${name} — pack dein Bier zusammen und komm zur Bühne!`,
    `🎸 ${name} startet in 15 Minuten. Jetzt ist ein guter Zeitpunkt, sich einen guten Platz zu sichern.`,
    `🌿 15 Minuten noch! ${name} wartet auf euch. Ab zur Bühne!`,
  ],
  5: (name) => [
    `🔥 Noch 5 Minuten bis ${name} losgeht — wo bist du?!`,
    `⏰ ${name} in 5 Minuten! Letzte Chance für ein Bier vorher.`,
    `🤘 5 Minuten! ${name} stimmt schon die Instrumente. Beeil dich!`,
  ],
  0: (name) => [
    `🎶 ${name} legt JETZT los! Ab zur Bühne!`,
    `🚨 Es geht los! ${name} spielt JETZT. Nichts wie hin!`,
    `🎸 ${name} ist gestartet! Wer noch nicht da ist — schnell!`,
  ],
}

function getRandomMessage(type, bandName) {
  const list = MESSAGES[type](bandName)
  return list[Math.floor(Math.random() * list.length)]
}

// ─── Patrick Hook ───
function usePatrickAlerts() {
  const [alert, setAlert] = useState(null)
  const [dismissed, setDismissed] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const bands = getAllBands()

      for (const band of bands) {
        for (const minutes of [15, 5, 0]) {
          const triggerKey = `${band.id}-${minutes}`
          if (dismissed.includes(triggerKey)) continue

          const diff = (band.date - now) / 1000 / 60 // Minuten bis Start
          const inWindow = diff <= minutes + 0.5 && diff >= minutes - 0.5

          if (inWindow) {
            setAlert({ message: getRandomMessage(minutes, band.name), key: triggerKey })
            break
          }
        }
      }
    }, 30000) // alle 30 Sekunden prüfen

    return () => clearInterval(interval)
  }, [dismissed])

  const dismiss = (key) => {
    setDismissed(d => [...d, key])
    setAlert(null)
  }

  return [alert, dismiss]
}

// ─── COMPONENT ───
export default function Patrick() {
  const [open, setOpen] = useState(false)
  const [alert, dismissAlert] = usePatrickAlerts()

  // Alert öffnet Patrick automatisch
  useEffect(() => {
    if (alert) setOpen(true)
  }, [alert])

  return (
    <>
      {open && (
        <div className="patrick-overlay">
          <div className="patrick-overlay-header">
            <span className="patrick-overlay-title">PATRICK</span>
            <button className="patrick-close" onClick={() => {
              setOpen(false)
              if (alert) dismissAlert(alert.key)
            }}>✕</button>
          </div>
          <div className="patrick-overlay-body">
            {alert ? (
              <p className="patrick-message patrick-message--alert">
                {alert.message}
              </p>
            ) : (
              <p className="patrick-message">
                Hey! Ich bin Patrick. Frag mich alles über das Festival — Zeiten, Orte, Regeln, Wetter.
              </p>
            )}
            {/* v2: Claude API Chat hier */}
          </div>
        </div>
      )}

      <button
        className={`patrick-btn ${alert ? 'patrick-btn--alert' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Patrick — Festival-Assistent"
      >
        <img src="/Patrick.png" alt="Patrick" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
      </button>
    </>
  )
}
