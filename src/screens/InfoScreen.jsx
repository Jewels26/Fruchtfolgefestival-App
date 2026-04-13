import { useState } from 'react'
import './InfoScreen.css'

// ─── LOST & FOUND DATA ───
// Später: aus Admin-CMS laden
const LOST_AND_FOUND = [
  // { id: 1, item: 'Schwarze Jacke, Größe M', found: 'Fr. 22:00', location: 'Bar' },
  // Einträge hier ergänzen oder später per Admin-Panel
]

// ─── SUBCOMPONENTS ───

function EmergencyCard() {
  return (
    <div className="card emergency-card">
      <div className="emergency-header">
        <span className="emergency-icon">💀</span>
        <span className="emergency-label">EMERGENCY</span>
      </div>
      <a href="tel:+4900000000000" className="emergency-number">
        +49 0000<br />000 000
      </a>
      <span className="emergency-sub">24/7 FESTIVAL SAFETY</span>
      <p className="emergency-note">Platzhalter — echte Nummer von Organisatoren eintragen</p>
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
      <h3 className="info-section-title">RITUAL TIMES</h3>
      <div className="opening-hours">
        <div className="opening-day">
          <span className="opening-day-label">FRI 28.8.</span>
          <div className="opening-times">
            <div className="opening-time-row">
              <span className="opening-time-name">Campground Access</span>
              <span className="opening-time-val">14:00</span>
            </div>
            <div className="opening-time-row">
              <span className="opening-time-name">Doors Festivalground</span>
              <span className="opening-time-val">16:00</span>
            </div>
          </div>
        </div>
        <div className="opening-divider" />
        <div className="opening-day">
          <span className="opening-day-label">SAT 29.8.</span>
          <div className="opening-times">
            <div className="opening-time-row">
              <span className="opening-time-name">Doors Festivalground</span>
              <span className="opening-time-val">13:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TheCode() {
  const [expanded, setExpanded] = useState(false)

  const shortText = `So wie ein Acker nur dann wirklich aufblüht, wenn verschiedene Feldfrüchte in natürlicher Folge wachsen dürfen, braucht auch Musik Vielfalt, damit sie uns berührt und verbindet.`

  const fullText = `So wie ein Acker nur dann wirklich aufblüht, wenn verschiedene Feldfrüchte in natürlicher Folge wachsen dürfen, braucht auch Musik Vielfalt, damit sie uns berührt und verbindet. Aber am Ende sind es nicht nur die Töne, die bunt sein sollen – es sind die Menschen.

Genau deshalb ist das Fruchtfolgefestival viel mehr als ein Musikereignis. Es ist ein Ort, an dem Unterschiedlichkeit gefeiert wird und an dem wir gemeinsam zeigen: Vielfalt macht uns stark.

Bei uns stehen Menschen im Mittelpunkt – mit all ihren Geschichten, Identitäten, Hoffnungen, Eigenheiten und Träumen. Wir glauben daran, dass Kultur nur dann lebendig ist, wenn alle Platz darin haben. Egal, wo du herkommst. Wen du liebst. Wie du aussiehst. Wie du dich fühlst. Oder wie du dein Leben lebst.

Wir wollen, dass sich jeder auf unseren Flächen willkommen und sicher fühlt. Dass Fremde zu Freund*innen werden. Dass Musik Grenzen aufhebt, anstatt neue zu ziehen.

Gleichzeitig ziehen wir eine klare Linie: Diskriminierung hat bei uns keinen Platz – in keiner Form. Wir stehen auf, wenn andere abwerten. Wir halten zusammen, wenn andere ausgrenzen.

Und wir sagen es laut und deutlich: Rechtsextremismus hat bei uns nichts verloren. Wir glauben an eine offene, demokratische Gesellschaft, in der Freiheit, Vielfalt und Würde für alle gelten.

Denn wie auf dem Feld gilt auch für uns: Nur dort, wo Vielfalt wachsen darf, entsteht Zukunft. Und genau diese Zukunft wollen wir beim Fruchtfolgefestival gemeinsam gestalten – bunt, laut, herzlich und frei. 🌾`

  return (
    <div className="card info-section-card">
      <h3 className="info-section-title">THE CODE</h3>
      <p className="the-code-text">
        {expanded ? fullText : shortText}
      </p>
      <button
        className="the-code-toggle"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? '↑ Weniger lesen' : '↓ Mehr lesen'}
      </button>
    </div>
  )
}

function LostAndFound() {
  return (
    <div className="card info-section-card">
      <h3 className="info-section-title">LOST & FOUND</h3>
      <p className="lost-found-hint">
        Gefundene Gegenstände können an der <strong>Bar</strong> oder am <strong>Einlass</strong> abgeholt werden.
      </p>
      {LOST_AND_FOUND.length === 0 ? (
        <p className="lost-found-empty">Noch keine Fundgegenstände gemeldet.</p>
      ) : (
        <ul className="lost-found-list">
          {LOST_AND_FOUND.map(item => (
            <li key={item.id} className="lost-found-item">
              <span className="lost-found-item-name">{item.item}</span>
              <span className="lost-found-item-meta">{item.found} · {item.location}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DonationCard() {
  return (
    <div className="card donation-card">
      <div className="donation-header">
        <span className="donation-icon">🌾</span>
        <h3 className="donation-title">SUPPORT THE HARVEST</h3>
      </div>
      <p className="donation-text">
        Das Festival lebt von eurer Energie — und eurer Unterstützung. Jeder Beitrag hilft uns, auch nächstes Jahr wieder die Tore zu öffnen.
      </p>
      <button className="donation-btn" disabled>
        Spenden / Trinkgeld
        <span className="donation-coming-soon">COMING SOON</span>
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
      <InfoRow
        icon="🩺"
        title="MEDICAL"
        text="Erste-Hilfe-Stationen auf dem Gelände"
      />
      <InfoRow
        icon="🚿"
        title="HYGIENE"
        text="Kompost-Toiletten & Duschen"
      />
      <InfoRow
        icon="💬"
        title="FEEDBACK"
        text="Sag uns was du denkst"
        href="https://fruchtfolge.live/contact/"
      />

      {/* Öffnungszeiten */}
      <OpeningHours />

      {/* The Code */}
      <TheCode />

      {/* Lost & Found */}
      <LostAndFound />

      {/* Spenden */}
      <DonationCard />

    </div>
  )
}
