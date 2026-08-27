import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { drawPfeffi, getStoredWin, getCooldownRemaining, warmupPfeffi, isWinExpired, getRedemptionDeadline, isUrgentRedemption, isDelayedRedemption, PFEFFI_LAST_DRAW } from '../utils/pfeffi'
import { FESTIVAL_CONFIG, getNow } from '../utils/festivalConfig'
import { usePatrick } from '../context/usePatrick'
import { isStandalone } from '../utils/standalone'
import './GluecksPfeffiScreen.css'

// ─── Easter Egg: Samstagvormittag (ab 7 Uhr — davor zählt noch als Nacht), vor Bar-Öffnung, und schon am Pfeffi-Würfeln ───
const SATURDAY_MORNING_COMMENTS = [
  `Aha, Zahnbürschtl vergessn? 🪥`,
  `Vor 12 scho ans Pfeffi denken? Respekt fürn Ehrgeiz, aber d'Bar schlaft no. 😴`,
  `Host as Frühstück ausfoin lassn, oder wieso pressiert's mit'm Pfeffi scho so früh? 🥐`,
  `Die Sonn is grad erst aufgangen und du bist scho am Würfeln. I mog des. 🌅`,
]

function isSaturdayMorning(now) {
  return now.getDay() === 6 && now.getHours() >= 7 && now.getHours() < 12
}

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

// Cooldown ist immer < 30 Min. (kein Stundenanteil), aber die Einlöse-Restzeit
// kann bei einem Gewinn während einer Schließzeit auf mehrere Stunden anwachsen
// (siehe isDelayedRedemption) — deshalb Stunden mit anzeigen, wenn nötig.
function formatCooldown(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function GluecksPfeffiScreen() {
  const navigate = useNavigate()
  const now = useClock()
  const { triggerPatrick } = usePatrick()
  const [win, setWin] = useState(getStoredWin)
  const [trying, setTrying] = useState(false)
  const [justLost, setJustLost] = useState(false)
  const [justError, setJustError] = useState(false)
  const [cooldown, setCooldown] = useState(getCooldownRemaining)
  // Glücks-Pfeffi gibt's nur in der installierten App, nicht im Browser-Tab —
  // Install-Anreiz. Ein bereits gewonnenes Ticket bleibt aber unabhängig davon
  // sichtbar/einlösbar, siehe win-Handling weiter unten.
  const [standalone] = useState(isStandalone)

  useEffect(() => {
    const id = setInterval(() => setCooldown(getCooldownRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  // Apps-Script-Instanz vorwärmen, solange der Besucher noch den Intro-Text
  // liest — reduziert die Cold-Start-Wartezeit beim eigentlichen Klick.
  // Ohne Standalone-Modus kann eh nicht gewürfelt werden, also gar nicht erst anfragen.
  useEffect(() => {
    if (standalone) warmupPfeffi()
  }, [standalone])

  const festivalNotStarted = now < FESTIVAL_CONFIG.gatesOpen
  const festivalOver = now > FESTIVAL_CONFIG.festivalEnd
  // Samstagnacht macht die Bar endgültig zu (keine Wiedereröffnung mehr) —
  // ab PFEFFI_LAST_DRAW lohnt sich ein neuer Wurf nicht mehr sicher.
  const drawingClosedForNight = !festivalOver && now >= PFEFFI_LAST_DRAW

  async function handleTry() {
    if (isSaturdayMorning(now)) {
      triggerPatrick(SATURDAY_MORNING_COMMENTS[Math.floor(Math.random() * SATURDAY_MORNING_COMMENTS.length)])
    }
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
    const msLeft = getRedemptionDeadline(win.ts).getTime() - now.getTime()
    const urgent = isUrgentRedemption(win.ts)
    const delayed = isDelayedRedemption(win.ts)
    return (
      <div className="screen pfeffi-screen fade-in">
        <div className="card pfeffi-win-card">
          <p className="pfeffi-win-headline">🎉 GLÜCKS-PFEFFI GEWONNEN! 🎉</p>
          <p className="pfeffi-win-instruction">Zeig dieses Display an der Bar — dein Pfeffi wartet dort auf di.</p>
          {urgent && <p className="pfeffi-win-urgent">Jetzt aber no schnell einlösen — d'Bar macht gleich zua! ⏱️</p>}
          {delayed && <p className="pfeffi-win-note">D'Bar hat grad zua — deine Einlösefrist startet erst, sobald sie wieder aufmacht.</p>}
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

      {!standalone && (
        <div className="card pfeffi-status-card">
          <p>Des Glücks-Pfeffi gibt's nur in der installierten App, ned im Browser-Tab. 📲</p>
          <p>Zum Installieren: aufs Teilen-Symbol (iPhone) bzw. übers Browser-Menü (Android) und "Zum Home-Bildschirm hinzufügen" bzw. "App installieren" wählen. Dann nochmal herkommen und Glück versuchen. 🍀</p>
        </div>
      )}

      {standalone && festivalNotStarted && (
        <div className="card pfeffi-status-card">
          <p>No ned so weit — Glücks-Pfeffi startet sobald d'Tore offen san. 🍀</p>
        </div>
      )}

      {standalone && festivalOver && (
        <div className="card pfeffi-status-card">
          <p>Des Festival is vorbei. Nächstes Jahr wieder. 🍀</p>
        </div>
      )}

      {standalone && drawingClosedForNight && (
        <div className="card pfeffi-status-card">
          <p>Fürs Glücks-Pfeffi is heid Nacht Schluss — d'Bar macht gleich endgültig zua. War a schöns Fest! 🍀</p>
        </div>
      )}

      {standalone && !festivalNotStarted && !festivalOver && !drawingClosedForNight && (
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
