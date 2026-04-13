import { useState } from 'react'
import './FoodScreen.css'

const STANDS = [
  {
    id: 'food-stand',
    name: 'Feldküche',
    category: 'food',
    location: 'Festivalground',
    icon: '🍖',
    description: 'Frisch vom Grill und aus der Fritteuse — für alle was dabei.',
    items: [
      { name: 'Bratwurstsemmel', tags: ['FLEISCH'] },
      { name: 'Bratwurstsemmel', tags: ['VEGGIE'] },
      { name: 'Bratwurstsemmel', tags: ['VEGAN'] },
      { name: 'Hotdog', note: 'Röstzwiebeln, Pickles, Käse, Jalapeños', tags: [] },
      { name: 'Chilidog', note: '+ Chili sin Carne', tags: ['VEGAN'] },
      { name: 'Falafelsandwich', tags: ['VEGAN'] },
      { name: 'Pommes', tags: ['VEGAN'] },
      { name: 'Chili Cheese Fries', note: 'Chili sin Carne & Käse', tags: ['VEGGIE'] },
      { name: 'Maiskolben', tags: ['VEGAN'] },
      { name: 'Frisches Obst', tags: ['VEGAN'] },
    ],
    condiments: 'Ketchup · Senf · Mayo zum Selbstwürzen',
  },
  {
    id: 'bar',
    name: 'Festivalbar',
    category: 'drinks',
    location: 'Festivalground',
    icon: '🍺',
    description: 'Kalt, laut, gesellig — die Hauptbar des Festivals.',
    items: [
      { name: 'Bier', tags: [] },
      { name: 'Weinschorle', tags: [] },
      { name: 'Softdrinks', tags: [] },
      { name: 'Discoschorle', note: 'Wein + Limo', tags: [] },
      { name: 'Einfache Mischgetränke', tags: [] },
    ],
  },
  {
    id: 'sansibar',
    name: 'Sansibar',
    category: 'drinks',
    location: 'Campground',
    icon: '🏝',
    description: 'Das besondere Konzept: Bring deinen Alkohol mit, unsere Barkeeper mixen — fast kostenlos.',
    highlight: true,
    items: [
      { name: 'BYO Spirits', note: 'Alkohol von Zuhause mitbringen & abstellen', tags: [] },
      { name: 'Barkeeper-Magie', note: '2–3 Barkeeper mixen aus dem was da ist', tags: [] },
      { name: 'Softdrinks', note: 'Zukauf an der Festivalbar nötig', tags: [] },
    ],
    note: 'Softdrinks müssen an der Festivalbar dazugekauft werden. Der Rest ist quasi kostenlos. 🤘',
  },
]

const FILTERS = [
  { key: 'all',    label: 'ALL' },
  { key: 'food',   label: 'FOOD' },
  { key: 'drinks', label: 'DRINKS' },
  { key: 'vegan',  label: 'VEGAN' },
]

function tagClass(tag) {
  if (tag === 'VEGAN')   return 'badge--vegan'
  if (tag === 'VEGGIE')  return 'badge--veggie'
  if (tag === 'FLEISCH') return 'badge--meat'
  return ''
}

function StandCard({ stand }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`card stand-card ${stand.highlight ? 'stand-card--highlight' : ''}`}>
      <div className="stand-header" onClick={() => setOpen(o => !o)}>
        <div className="stand-icon-wrap">
          <span className="stand-icon">{stand.icon}</span>
        </div>
        <div className="stand-meta">
          <h2 className="stand-name">{stand.name}</h2>
          <span className="stand-location">📍 {stand.location}</span>
        </div>
        <span className={`stand-toggle ${open ? 'stand-toggle--open' : ''}`}>›</span>
      </div>

      <p className="stand-description">{stand.description}</p>

      {open && (
        <div className="stand-items fade-in">
          <div className="stand-divider" />
          <ul className="stand-item-list">
            {stand.items.map((item, i) => (
              <li key={i} className="stand-item">
                <div className="stand-item-left">
                  <span className="stand-item-name">{item.name}</span>
                  {item.note && <span className="stand-item-note">{item.note}</span>}
                </div>
                <div className="stand-item-tags">
                  {item.tags.map(tag => (
                    <span key={tag} className={`badge ${tagClass(tag)}`}>{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          {stand.condiments && <p className="stand-condiments">+ {stand.condiments}</p>}
          {stand.note     && <p className="stand-note">{stand.note}</p>}
        </div>
      )}
    </div>
  )
}

export default function FoodScreen() {
  const [filter, setFilter] = useState('all')

  const filtered = STANDS.filter(stand => {
    if (filter === 'all')    return true
    if (filter === 'food')   return stand.category === 'food'
    if (filter === 'drinks') return stand.category === 'drinks'
    if (filter === 'vegan')  return stand.items.some(i => i.tags.includes('VEGAN'))
    return true
  })

  return (
    <div className="screen food-screen fade-in">
      <h1 className="screen-title">FOOD & DRINKS</h1>
      <div className="screen-title-underline" />

      <div className="food-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stand-list">
        {filtered.map(stand => (
          <StandCard key={stand.id} stand={stand} />
        ))}
      </div>
    </div>
  )
}
