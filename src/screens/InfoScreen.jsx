import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFundsachen, FUNDSACHEN_POLL_INTERVAL } from '../utils/fundsachen'
import { FESTIVAL_ABC, entrySearchText } from '../data/festivalABC'
import { renderRichText } from '../utils/richText'
import './InfoScreen.css'

function useFundsachen() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchFundsachen().then(setItems)
    const id = setInterval(() => fetchFundsachen().then(setItems), FUNDSACHEN_POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return items
}

// ─── SUBCOMPONENTS ───

function EmergencyCard() {
  return (
    <div className="card emergency-card">
      <div className="emergency-header">
        <span className="emergency-icon">💀</span>
        <span className="emergency-label">NOTFALL</span>
      </div>
      <a href="tel:112" className="emergency-number">112</a>
      <span className="emergency-sub">IM ERNSTFALL</span>
    </div>
  )
}

// Verlinkt zur Karte und lässt dort die passende Nummer aufleuchten.
function MapLink({ area, num, label = 'Auf der Karte anzeigen' }) {
  const navigate = useNavigate()
  return (
    <button
      className="info-map-link"
      onClick={() => navigate(`/map?area=${area}&highlight=${num}`)}
    >
      📍 {label}
    </button>
  )
}

function MedicalRow() {
  return (
    <div className="info-row card">
      <span className="info-row-icon">🩺</span>
      <div className="info-row-text">
        <span className="info-row-title">ERSTE HILFE</span>
        <MapLink area="festivalground" num={5} />
        <span className="info-row-body">
          Erste-Hilfe-Koffer findest du an der Kasse beim Einlass. Falls grad kein Teammitglied erkennbar ist, unsere medizinische Ersthelferin Linda anrufen:{' '}
          <a href="tel:+491791385851" className="info-row-phone">0179 1385 851</a>
        </span>
      </div>
    </div>
  )
}

function InfoRow({ icon, title, text, href }) {
  const content = (
    <div className="info-row card">
      <span className="info-row-icon">{icon}</span>
      <div className="info-row-text">
        <span className="info-row-title">{title}</span>
        <span className="info-row-body">{text}</span>
      </div>
      {href && <span className="info-row-arrow">›</span>}
    </div>
  )
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="info-row-link">{content}</a>
  return content
}

function OpeningHours() {
  return (
    <div className="card info-section-card">
      <h3 className="info-section-title">FESTIVAL ZEITEN</h3>
      <div className="opening-hours">
        <div className="opening-day">
          <span className="opening-day-label">FR 28.8.</span>
          <div className="opening-times">
            <div className="opening-time-row">
              <span className="opening-time-name">Einlass Campingplatz</span>
              <span className="opening-time-val">14:00</span>
            </div>
            <div className="opening-time-row">
              <span className="opening-time-name">Einlass Festivalgelände</span>
              <span className="opening-time-val">16:00</span>
            </div>
            <div className="opening-time-row">
              <span className="opening-time-name">Ende</span>
              <span className="opening-time-val">00:00</span>
            </div>
            <div className="opening-time-row">
              <span className="opening-time-name">Feldküche</span>
              <span className="opening-time-val">16:00–22:00</span>
            </div>
          </div>
        </div>
        <div className="opening-divider" />
        <div className="opening-day">
          <span className="opening-day-label">SA 29.8.</span>
          <div className="opening-times">
            <div className="opening-time-row">
              <span className="opening-time-name">Einlass Festivalgelände</span>
              <span className="opening-time-val">12:00</span>
            </div>
            <div className="opening-time-row">
              <span className="opening-time-name">Ende</span>
              <span className="opening-time-val">00:00</span>
            </div>
            <div className="opening-time-row">
              <span className="opening-time-name">Feldküche</span>
              <span className="opening-time-val">12:00–22:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ABCEntry({ entry, isOpen, onToggle }) {
  return (
    <div className={`abc-entry ${isOpen ? 'abc-entry--open' : ''}`}>
      <button className="abc-entry-header" onClick={onToggle}>
        <span className="abc-entry-title">{entry.letter} wie {entry.title}</span>
        <span className={`abc-entry-arrow ${isOpen ? 'abc-entry-arrow--open' : ''}`}>›</span>
      </button>
      {isOpen && (
        <div className="abc-entry-body fade-in">
          {entry.blocks.map((block, i) => {
            if (block.type === 'ul') {
              return (
                <ul key={i} className="abc-list">
                  {block.items.map((item, j) => <li key={j}>{renderRichText(item)}</li>)}
                </ul>
              )
            }
            if (block.type === 'table') {
              return (
                <div key={i} className="abc-price-table">
                  {block.rows.map((row, j) => (
                    <div key={j} className="abc-price-row">
                      <span>{row.name}</span>
                      <span className="abc-price-val">{row.price}</span>
                    </div>
                  ))}
                </div>
              )
            }
            return <p key={i} className="abc-p">{renderRichText(block.text)}</p>
          })}
        </div>
      )}
    </div>
  )
}

function FestivalABC() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openEntryId, setOpenEntryId] = useState(null)

  const letters = useMemo(
    () => [...new Set(FESTIVAL_ABC.map(e => e.letter))],
    []
  )

  const q = query.trim().toLowerCase()
  const filtered = q
    ? FESTIVAL_ABC.filter(e => entrySearchText(e).includes(q))
    : FESTIVAL_ABC

  function jumpTo(letter) {
    const el = document.getElementById(`abc-letter-${letter}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="card info-section-card abc-card">
      <button className="abc-header" onClick={() => setOpen(o => !o)}>
        <h3 className="info-section-title abc-title">FESTIVAL ABC</h3>
        <span className={`abc-toggle ${open ? 'abc-toggle--open' : ''}`}>›</span>
      </button>

      {!open && (
        <p className="abc-teaser">
          Alles von A bis Z — Anreise, Bändchen, Cannabis, Notfall, Zanzibar & mehr.
        </p>
      )}

      {open && (
        <div className="abc-body fade-in">
          <input
            type="text"
            className="abc-search"
            placeholder="Suchen … z. B. Bargeld, Camping, Notfall"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {!q && (
            <div className="abc-letterbar">
              {letters.map(l => (
                <button key={l} className="abc-letter-btn" onClick={() => jumpTo(l)}>{l}</button>
              ))}
            </div>
          )}

          <div className="abc-entries">
            {filtered.length === 0 && (
              <p className="abc-empty">Nix gefunden. Frag doch Patrick. 🤖</p>
            )}
            {filtered.map((entry, i) => {
              const isFirstOfLetter = filtered[i - 1]?.letter !== entry.letter
              return (
                <div key={entry.id} id={!q && isFirstOfLetter ? `abc-letter-${entry.letter}` : undefined}>
                  {!q && isFirstOfLetter && <div className="abc-letter-heading">{entry.letter}</div>}
                  <ABCEntry
                    entry={entry}
                    isOpen={Boolean(q) || openEntryId === entry.id}
                    onToggle={() => setOpenEntryId(id => (id === entry.id ? null : entry.id))}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function LostAndFound() {
  const items = useFundsachen()

  return (
    <div className="card info-section-card">
      <h3 className="info-section-title info-section-title--tight">FUNDSACHEN</h3>
      <MapLink area="festivalground" num={10} />
      <p className="lost-found-hint">
        Gefundene Gegenstände können am <strong>Einlass</strong> abgeholt werden.
      </p>
      {items.length === 0 ? (
        <p className="lost-found-empty">Noch keine Fundgegenstände gemeldet.</p>
      ) : (
        <ul className="lost-found-list">
          {items.map(item => (
            <li key={item.id} className="lost-found-item">
              <span className="lost-found-item-name">{item.gegenstand}</span>
              <span className="lost-found-item-meta">{item.gefunden}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DonationCard() {
  const [copied, setCopied] = useState(false)
  const iban = 'DE83 7005 3070 0032 8796 03'

  function handleCopy() {
    navigator.clipboard.writeText(iban.replace(/\s/g, '')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="card donation-card">
      <div className="donation-header">
        <span className="donation-icon">🌾</span>
        <h3 className="donation-title">SUPPORT THE FRUCHTFOLGE</h3>
      </div>
      <p className="donation-text">
        Wenn es dir gefallen hat und du uns für die nächste Fruchtfolge unterstützen willst, kannst du gerne eine Kleinigkeit spenden.
      </p>
      <button className="donation-btn" onClick={handleCopy}>
        <span className="donation-iban">{iban}</span>
        <span className="donation-copy-label">{copied ? 'Kopiert ✓' : 'Kopieren'}</span>
      </button>
    </div>
  )
}

// ─── MAIN SCREEN ───
export default function InfoScreen() {
  return (
    <div className="screen info-screen fade-in">

      <h1 className="screen-title">INFO</h1>
      <div className="screen-title-underline" />

      {/* Emergency */}
      <EmergencyCard />

      {/* Quick Links */}
      <InfoRow
        icon="🎫"
        title="TICKETS"
        text="Jetzt Tickets sichern für FFF 2026"
        href="https://eventfrog.de/de/p/festivals/pop-rock/fruchtfolgefestival-2026-7428465056327708123.html"
      />
      <MedicalRow />
      <InfoRow
        icon="💬"
        title="FEEDBACK"
        text="Sag uns was du denkst"
        href="https://fruchtfolge.live/contact/"
      />

      {/* Öffnungszeiten */}
      <OpeningHours />

      {/* Festival ABC */}
      <FestivalABC />

      {/* Lost & Found */}
      <LostAndFound />

      {/* Spenden */}
      <DonationCard />

    </div>
  )
}
