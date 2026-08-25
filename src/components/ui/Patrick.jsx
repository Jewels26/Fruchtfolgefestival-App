import { useState, useEffect, useRef } from 'react'
import { LINEUP } from '../../data/lineup'
import { asset } from '../../utils/assetPath'
import { usePatrick } from '../../context/usePatrick'
import { matchPatrick, pickSuggestedQuestions } from '../../utils/patrickMatcher'
import { getNow } from '../../utils/festivalConfig'
import { loadSeenSet, saveSeenSet } from '../../utils/persistedSet'
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
// 15/5 bekommen die tatsächliche Restzeit übergeben (nicht starr 15/5), weil die
// Fensterprüfung inzwischen einen ganzen Zeitraum statt eines exakten Zeitpunkts
// abdeckt (siehe bandAlertTier) — man kann also auch bei 12 oder 3 Minuten reinschauen.
const MESSAGES = {
  15: (name, mins) => [
    `⚡ Noch ${mins} Minuten bis ${name} — pack dein Bier zusammen und komm zur Bühne!`,
    `🎸 ${name} startet in ${mins} Minuten. Jetzt ist ein guter Zeitpunkt, sich einen guten Platz zu sichern.`,
    `🌿 ${mins} Minuten noch! ${name} wartet auf euch. Ab zur Bühne!`,
  ],
  5: (name, mins) => [
    `🔥 Noch ${mins} Minuten bis ${name} losgeht — wo bist du?!`,
    `⏰ ${name} in ${mins} Minuten! Letzte Chance für ein Bier vorher.`,
    `🤘 ${mins} Minuten! ${name} stimmt schon die Instrumente. Beeil dich!`,
  ],
  0: (name) => [
    `🎶 ${name} legt JETZT los! Ab zur Bühne!`,
    `🚨 Es geht los! ${name} spielt JETZT. Nichts wie hin!`,
    `🎸 ${name} ist gestartet! Wer noch nicht da ist — schnell!`,
  ],
}

// Zeitfenster helfen: Uhrzeit-Ranges, die über Mitternacht wrappen (z.B. 21–2 Uhr),
// und der Samstag-Vormittag zwischen Nachtruhe-Ende (8 Uhr) und Einlass (12 Uhr).
function inHourRange(now, start, end) {
  const h = now.getHours()
  return start <= end ? (h >= start && h < end) : (h >= start || h < end)
}

function inFoodWindow(now) {
  const day = now.getDay() // 5 = Freitag, 6 = Samstag
  if (day === 5) return inHourRange(now, 16, 22)
  if (day === 6) return inHourRange(now, 12, 22)
  return false
}

function isSatMorning(now) {
  return now.getDay() === 6 && inHourRange(now, 8, 12)
}

const STATUS_MESSAGES = [
  { text: 'schaut grad bei der Bühne vorbei' },
  { text: 'trinkt grad an Maisacher' },
  { text: 'redet grad mit\'m Joe' },
  { text: 'lauft grad übern Campingplatz' },
  { text: 'schaut wos grad Flunkyball spieln' },
  { text: 'macht grad kurz a Pause' },
  { text: 'hängt grad am Lagerfeuer', when: now => inHourRange(now, 21, 2) },
  { text: 'schaut ob\'s Disco Schorle no gibt' },
  { text: 'holt sich grad Pommes', when: inFoodWindow },
  { text: 'schaut ob da Perzi scho grillt' },
  { text: 'redet grad mit der Thea' },
  // 2–8 Uhr: exklusives Fenster, in dem NUR diese zwei Stati wählbar san.
  // "singt..." ploppt bloß mit 10 % Chance auf (weight 1 vs. 9).
  { text: 'schlaft grad', when: now => inHourRange(now, 2, 8), exclusive: true, weight: 9 },
  { text: 'singt grad des Lied vom Kleopatra-Löwen', when: now => inHourRange(now, 2, 8), exclusive: true, weight: 1 },
  // Samstag-Vormittag, zwischen Nachtruhe-Ende und Einlass
  { text: 'frühstückt grad', when: isSatMorning },
  { text: 'wird grad langsam wach', when: isSatMorning },
  { text: 'putzt si grad d\'Zähn', when: isSatMorning },
  { text: 'macht si grad frisch', when: isSatMorning },
  { text: 'chillt grad a bissl', when: isSatMorning },
]

function weightedPick(list) {
  const total = list.reduce((sum, s) => sum + (s.weight ?? 1), 0)
  let r = Math.random() * total
  for (const s of list) {
    r -= s.weight ?? 1
    if (r < 0) return s
  }
  return list[list.length - 1]
}

function pickStatus(prevText) {
  const now = getNow()
  const active = STATUS_MESSAGES.filter(s => !s.when || s.when(now))
  // Exklusive Stati (z.B. Schlafen) verdrängen die generischen, solang sie aktiv san.
  const exclusive = active.filter(s => s.exclusive)
  const basePool = exclusive.length ? exclusive : active
  const pool = basePool.filter(s => s.text !== prevText)
  const list = pool.length ? pool : basePool
  return weightedPick(list).text
}

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

function getRandomMessage(type, bandName, mins) {
  return getRandomFrom(MESSAGES[type](bandName, mins))
}

// ─── Band-Countdown-Alerts ───
// Statt eines exakten 60-Sekunden-Zeitpunkts deckt jede Stufe einen ganzen
// Zeitraum ab: 15er-Fenster (15 bis 5 Min. vorher), 5er-Fenster (5 bis 0 Min.
// vorher), 0er-Fenster (Start bis 5 Min. danach). So kommt die Erinnerung auch
// an, wenn man die App erst mittendrin öffnet, statt nur in der einen
// zufälligen Minute, in der der Timer zufällig tickt.
function bandAlertTier(diffMinutes) {
  if (diffMinutes <= 15.5 && diffMinutes > 5.5) return 15
  if (diffMinutes <= 5.5 && diffMinutes > -0.5) return 5
  if (diffMinutes <= 0.5 && diffMinutes >= -5) return 0
  return null
}

const BAND_ALERTS_STORAGE_KEY = 'band-alerts'

function usePatrickAlerts(triggerPatrick) {
  useEffect(() => {
    const seen = loadSeenSet(BAND_ALERTS_STORAGE_KEY)

    function check() {
      const now = getNow()
      const bands = getAllBands()

      for (const band of bands) {
        const diff = (band.date - now) / 1000 / 60
        const tier = bandAlertTier(diff)
        if (tier === null) continue

        const key = `${band.id}-${tier}`
        if (seen.has(key)) continue

        // Verpasste frühere Stufen (z.B. 15er, wenn man erst im 5er-Fenster
        // reinschaut) gelten als erledigt, damit sie nicht nachträglich noch anspringen.
        for (const t of [15, 5, 0]) {
          if (t > tier) seen.add(`${band.id}-${t}`)
        }
        seen.add(key)
        saveSeenSet(BAND_ALERTS_STORAGE_KEY, seen)

        const mins = Math.max(1, Math.round(diff))
        triggerPatrick(getRandomMessage(tier, band.name, mins))
        break
      }
    }

    check()
    const interval = setInterval(check, 30000)
    const onVisible = () => { if (document.visibilityState === 'visible') check() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [triggerPatrick])
}

// ─── Feldküche-Reminder: Zeitfenster vor Schluss (22 Uhr) ───
const FELDKUECHE_CLOSE = Object.values(FESTIVAL_DATES).map(date => new Date(`${date}T22:00:00`))

const FELDKUECHE_ALERT_STORAGE_KEY = 'feldkueche-alert'

function useFeldkuecheAlert(triggerPatrick) {
  useEffect(() => {
    const seen = loadSeenSet(FELDKUECHE_ALERT_STORAGE_KEY)

    function check() {
      const now = getNow()
      for (const closeTime of FELDKUECHE_CLOSE) {
        const key = closeTime.toISOString()
        if (seen.has(key)) continue

        const diff = (closeTime - now) / 1000 / 60
        const inWindow = diff <= 90.5 && diff >= 15

        if (inWindow) {
          seen.add(key)
          saveSeenSet(FELDKUECHE_ALERT_STORAGE_KEY, seen)
          const mins = Math.max(1, Math.round(diff))
          const timeText = mins >= 55 ? 'in ana Stund' : `in ca. ${mins} Minuten`
          triggerPatrick(`Letzte Chance auf a warme Mahlzeit: d'Feldküche macht ${timeText} zu, um 22 Uhr. Wer no wos essen mog, sollt jetzt lossgeh. 🌭`)
          break
        }
      }
    }

    check()
    const interval = setInterval(check, 30000)
    const onVisible = () => { if (document.visibilityState === 'visible') check() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [triggerPatrick])
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
  const [suggestedQuestions, setSuggestedQuestions] = useState(() => pickSuggestedQuestions())
  const [input, setInput] = useState('')
  const [hasAlert, setHasAlert] = useState(false)
  const [typing, setTyping] = useState(false)
  const chatEndRef = useRef(null)
  // Tracks how many Patrick chunks are still pending in the current response.
  // Used to distinguish "last chunk arrived" (scroll to show full response)
  // from "intermediate chunk / typing" (scroll to bottom as usual).
  const pendingChunksRef = useRef(0)

  const [status, setStatus] = useState(() => pickStatus())
  const [statusVisible, setStatusVisible] = useState(true)

  // Wechselt den Status-Text alle ~10–12 Minuten mit Fade
  useEffect(() => {
    let t1, t2
    function cycle() {
      t1 = setTimeout(() => {
        setStatusVisible(false)
        t2 = setTimeout(() => {
          setStatus(prev => pickStatus(prev))
          setStatusVisible(true)
          cycle()
        }, 400)
      }, 600_000 + Math.random() * 120_000)
    }
    cycle()
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  usePatrickAlerts(triggerPatrick)
  useFeldkuecheAlert(triggerPatrick)

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
  }, [open, clearNotification])

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
          setSuggestedQuestions(pickSuggestedQuestions())
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
              {suggestedQuestions.map(q => (
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
