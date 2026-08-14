import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { drawPfeffi, getStoredWin, getCooldownRemaining, warmupPfeffi, isWinExpired, PFEFFI_REDEMPTION_WINDOW_MS } from '../utils/pfeffi'
import { FESTIVAL_CONFIG, getNow } from '../utils/festivalConfig'
import './GluecksPfeffiScreen.css'

function useClock() {
  const [now, setNow] = useState(getNow)
  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function formatClock(d) {
  return d.toLocaleTimeString('de-DE')
}

function formatWinTimestamp(iso) {
  return new Date(iso).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function formatCooldown(ms) {
  const totalSec = Math.ceil(ms / 1000)
  return `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, '0')}`
}

export default function GluecksPfeffiScreen() {
  const navigate = useNavigate()
  const now = useClock()
  const [win, setWin] = useState(getStoredWin)
  const [trying, setTrying] = useState(false)
  const [justLost, setJustLost] = useState(false)
  const [justError, setJustError] = useState(false)
  const [cooldown, setCooldown] = useState(getCooldownRemaining)

  useEffect(() => {
    const id = setInterval(() => setCooldown(getCooldownRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  // Apps-Script-Instanz vorwärmen, solange der Besucher noch den Intro-Text
  // liest — reduziert die Cold-Start-Wartezeit beim eigentlichen Klick.
  useEffect(() => {
    warmupPfeffi()
  }, [])

  const festivalNotStarted = now < FESTIVAL_CONFIG.gatesOpen
  const festivalOver = now > FESTIVAL_CONFIG.festivalEnd

  async function handleTry() {
    setTrying(true)
    setJustLost(false)
    setJustError(false)
    const result = await drawPfeffi()
    setTrying(false)
    if (result.won) {
      setWin({ won: true, ts: result.ts })
    } else if (result.error) {
      setJustError(true)
    } else {
      setJustLost(true)
    }
    setCooldown(getCooldownRemaining())
  }

  if (win?.won && isWinExpired(win)) {
    return (
      <div className="screen pfeffi-screen fade-in">
        <div className="card pfeffi-expired-card">
          <p className="pfeffi-expired-headline">Einlösefrist abgelaufen ⏳</p>
          <p className="pfeffi-expired-text">
            Du hast am {formatWinTimestamp(win.ts)} gewonnen — das Zeitfenster zum Einlösen ist leider vorbei.
          </p>
        </div>
        <button className="btn pfeffi-back-btn" onClick={() => navigate('/')}>Zurück zur Startseite</button>
      </div>
    )
  }

  if (win?.won) {
    const msLeft = new Date(win.ts).getTime() + PFEFFI_REDEMPTION_WINDOW_MS - now.getTime()
    return (
      <div className="screen pfeffi-screen fade-in">
        <div className="card pfeffi-win-card">
          <p className="pfeffi-win-headline">🎉 GLÜCKS-PFEFFI GEWONNEN! 🎉</p>
          <p className="pfeffi-win-instruction">Zeig dieses Display an der Bar — dein Pfeffi wartet dort auf di.</p>
          <div className="pfeffi-win-divider" />
          <p className="pfeffi-live-clock">{formatClock(now)}</p>
          <p className="pfeffi-win-ts">Gewonnen am {formatWinTimestamp(win.ts)}</p>
          <p className="pfeffi-win-expiry">Noch gültig für {formatCooldown(Math.max(0, msLeft))}</p>
        </div>
        <button className="btn pfeffi-back-btn" onClick={() => navigate('/')}>Zurück zur Startseite</button>
      </div>
    )
  }

  return (
    <div className="screen pfeffi-screen fade-in">
      <h1 className="screen-title">GLÜCKS-PFEFFI</h1>
      <div className="screen-title-underline" />

      <div className="card pfeffi-intro-card">
        <p className="pfeffi-intro-text">
          Jeder Besucher hat a zufällige Chance auf an gratis Pfeffi. Einfach Glück versuchen —
          bei Gewinn zeigst du dieses Display einfach an der Bar.
        </p>
      </div>

      {festivalNotStarted && (
        <div className="card pfeffi-status-card">
          <p>No ned so weit — Glücks-Pfeffi startet sobald d'Tore offen san. 🍀</p>
        </div>
      )}

      {festivalOver && (
        <div className="card pfeffi-status-card">
          <p>Des Festival is vorbei. Nächstes Jahr wieder. 🍀</p>
        </div>
      )}

      {!festivalNotStarted && !festivalOver && (
        <div className="card pfeffi-action-card">
          {trying && <p className="pfeffi-loading">Würfel rolln... 🎲</p>}

          {!trying && justError && (
            <p className="pfeffi-error-text">Verbindung hat grad ned klappt. Probier's gleich nochmal. 📡</p>
          )}

          {!trying && !justError && cooldown > 0 && (
            <p className="pfeffi-lost-text">
              {justLost ? "Diesmal ned. Aber's Festival is no lang. 🍀" : 'Scho versucht — no a bissl Geduld.'}
            </p>
          )}

          {!trying && cooldown > 0 && (
            <p className="pfeffi-cooldown">Nächster Versuch in {formatCooldown(cooldown)}</p>
          )}

          {!trying && cooldown <= 0 && (
            <button className="btn pfeffi-try-btn" onClick={handleTry}>Glück versuchen</button>
          )}
        </div>
      )}
    </div>
  )
}
