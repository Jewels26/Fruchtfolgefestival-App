import { useState, useEffect, useRef } from 'react'
import { LINEUP } from '../../data/lineup'
import { asset } from '../../utils/assetPath'
import { usePatrick } from '../../context/PatrickContext'
import { matchPatrick, SUGGESTED_QUESTIONS } from '../../utils/patrickMatcher'
import './Patrick.css'

// ─── Alle Bands flach mit echtem Datum ───
const FESTIVAL_DATES = { FRI: '2026-08-28', SAT: '2026-08-29' }

function getAllBands() {
  return Object.entries(LINEUP).flatMap(([day, bands]) =>
    bands
      .filter(b => !b.secret)
      .map(b => {
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

const PLAY_BUTTON_MESSAGES = (name) => [
  `Haha, ich spiel da nix ab. 🎸 ${name} spielt LIVE auf der Bühne — da musst du schon hingehen!`,
  `Des is koa Spotify. ${name} macht das gerade live für dich — ab zur Bühne!`,
  `Streaming gibt's dahoam. Hier spielen echte Menschen! ${name} ist gerade drüben. 🤘`,
  `I bin a Festival-App, kein Musikplayer! Geh hin, ${name} wartet ned ewig.`,
]

const STATUS_MESSAGES = [
  'schaut grad bei der Bühne vorbei',
  'trinkt grad an Maisacher',
  'redet grad mit\'m Joe',
  'lauft grad übern Campground',
  'schaut wos grad Flunkyball spieln',
  'macht grad kurz a Pause',
  'hängt grad am Lagerfeuer',
  'schaut ob\'s Disco Schorle no gibt',
  'lost grad ins Set eine',
  'labt sich grad an Chili Cheese Fries',
  'schaut ob da Perzi scho grillt',
  'redet grad mit der Thea',
]

const FALLBACK_MESSAGES = [
  "Hm, des woaß i jetzt a ned so genau... Probier's mal mit was anderem! 😅",
  'Da bin i überfragt. Frag mi liaba was ums Festival! 🌾',
  'Ähm, des übersteigt mei Zuständigkeit. I kenn mi bei Festivals aus, ned bei allem. 😄',
]

function getRandomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

// Teilt eine Antwort an Satzgrenzen auf (max. 3 Bubbles)
function splitIntoChunks(text) {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/u).filter(p => p.trim())
  if (parts.length <= 1) return [text]
  if (parts.length > 3) return [parts[0], parts[1], parts.slice(2).join(' ')]
  return parts
}

function getRandomMessage(type, bandName) {
  return getRandomFrom(MESSAGES[type](bandName))
}

function getRandomPlayMessage(bandName) {
  return getRandomFrom(PLAY_BUTTON_MESSAGES(bandName))
}

// ─── Band-Countdown-Alerts ───
function usePatrickAlerts(triggerPatrick) {
  const [dismissed, setDismissed] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const bands = getAllBands()

      for (const band of bands) {
        for (const minutes of [15, 5, 0]) {
          const triggerKey = `${band.id}-${minutes}`
          if (dismissed.includes(triggerKey)) continue

          const diff = (band.date - now) / 1000 / 60
          const inWindow = diff <= minutes + 0.5 && diff >= minutes - 0.5

          if (inWindow) {
            const earlierKeys = [15, 5, 0]
              .filter(m => m > minutes)
              .map(m => `${band.id}-${m}`)
            setDismissed(d => [...new Set([...d, ...earlierKeys, triggerKey])])
            triggerPatrick(getRandomMessage(minutes, band.name))
            break
          }
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [dismissed, triggerPatrick])
}

const WELCOME = {
  role: 'patrick',
  text: 'Servus! I bin der Patrick. Frag mich alles übers Festival — Zeiten, Orte, Essen, Regeln... 🤘',
}

// ─── COMPONENT ───
export default function Patrick() {
  const { open, setOpen, externalMessage, clearExternalMessage, triggerPatrick, notification, clearNotification } = usePatrick()
  const [messages, setMessages] = useState([WELCOME])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [input, setInput] = useState('')
  const [hasAlert, setHasAlert] = useState(false)
  const [typing, setTyping] = useState(false)
  const chatEndRef = useRef(null)
  // Tracks how many Patrick chunks are still pending in the current response.
  // Used to distinguish "last chunk arrived" (scroll to show full response)
  // from "intermediate chunk / typing" (scroll to bottom as usual).
  const pendingChunksRef = useRef(0)

  const [status, setStatus] = useState(
    () => STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]
  )
  const [statusVisible, setStatusVisible] = useState(true)

  // Wechselt den Status-Text alle 3–6 Minuten mit Fade
  useEffect(() => {
    let t1, t2
    function cycle() {
      t1 = setTimeout(() => {
        setStatusVisible(false)
        t2 = setTimeout(() => {
          setStatus(prev => {
            const others = STATUS_MESSAGES.filter(s => s !== prev)
            return others[Math.floor(Math.random() * others.length)]
          })
          setStatusVisible(true)
          cycle()
        }, 400)
      }, 180_000 + Math.random() * 180_000)
    }
    cycle()
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  usePatrickAlerts(triggerPatrick)

  // Proaktive Nachrichten (Sheet-Trigger, Band-Alerts) → Chatverlauf
  useEffect(() => {
    if (!externalMessage) return
    setMessages(prev => [...prev, { role: 'patrick', text: externalMessage }])
    clearExternalMessage()
    setHasAlert(true)
    // clearExternalMessage ist stabil (ruft nur setExternalMessage(null) auf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMessage])

  // Alert-Puls und Notification-Bubble stoppen wenn Overlay geöffnet wird
  useEffect(() => {
    if (open) {
      setHasAlert(false)
      clearNotification()
    }
  }, [open])

  // Scroll-Logik:
  // • Während Patrick tippt oder noch Chunks kommen → ans Ende scrollen (Typing-Indikator sichtbar)
  // • Nach der letzten Chunk → zur letzten User-Nachricht scrollen, damit Patricks
  //   komplette Antwort darunter sichtbar ist
  useEffect(() => {
    if (!open) return
    if (typing || pendingChunksRef.current > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const container = chatEndRef.current?.parentElement
    if (container) {
      const userBubbles = container.querySelectorAll('.patrick-bubble--user')
      if (userBubbles.length > 0) {
        userBubbles[userBubbles.length - 1].scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, typing, open])

  function send(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setShowSuggestions(false)
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    const result = matchPatrick(trimmed)
    const chunks = splitIntoChunks(result?.text ?? getRandomFrom(FALLBACK_MESSAGES))

    pendingChunksRef.current = chunks.length
    setTyping(true)
    let t = 800 + Math.random() * 400

    chunks.forEach((chunk, i) => {
      setTimeout(() => {
        pendingChunksRef.current--
        setTyping(false)
        setMessages(prev => [...prev, { role: 'patrick', text: chunk }])
        if (i < chunks.length - 1) {
          setTimeout(() => setTyping(true), 120)
        } else if (!result) {
          setShowSuggestions(true)
        }
      }, t)
      if (i < chunks.length - 1) {
        t += 600 + Math.random() * 300
      }
    })
  }

  return (
    <>
      {open && (
        <div className="patrick-overlay">
          <div className="patrick-overlay-header">
            <span className="patrick-overlay-title">PATRICK</span>
            <button className="patrick-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="patrick-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`patrick-bubble patrick-bubble--${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="patrick-bubble patrick-bubble--patrick patrick-typing">
                <span className="patrick-dot" />
                <span className="patrick-dot" />
                <span className="patrick-dot" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {showSuggestions && (
            <div className="patrick-suggestions">
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} className="patrick-suggestion-btn" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="patrick-input-row">
            <input
              className="patrick-input"
              type="text"
              placeholder="Schreib was..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
            />
            <button
              className="patrick-send"
              onClick={() => send(input)}
              disabled={!input.trim()}
              aria-label="Senden"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className="patrick-notification">
          <span className="patrick-notification__text">{notification.text}</span>
          <button className="patrick-notification__close" onClick={clearNotification} aria-label="Schließen">✕</button>
        </div>
      )}

      <div className="patrick-btn-wrapper">
        <button
          className={`patrick-btn${hasAlert ? ' patrick-btn--alert' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Patrick — Festival-Assistent"
        >
          <img
            src={asset('Patrick.png')}
            alt="Patrick"
            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
          />
        </button>
        <span className={`patrick-status${!statusVisible || open ? ' patrick-status--hidden' : ''}`}>
          {status}
        </span>
      </div>
    </>
  )
}

export { getRandomPlayMessage }
