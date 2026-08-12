import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { IconFeldkueche, IconFestivalbar, IconZanzibar, IconWahrsagerzelt, IconMerch } from './FoodIcons'
import { fetchEssen, ESSEN_POLL_INTERVAL, fetchGetraenke, GETRAENKE_POLL_INTERVAL, formatPrice } from '../utils/essen'
import { fetchMerch, MERCH_POLL_INTERVAL } from '../utils/merch'
import { asset } from '../utils/assetPath'
import './FoodScreen.css'

// Merch läuft über einen eigenen Sheet-Tab (Größen/Preise/Ausverkauft je Produkt) —
// Fotos und Produktnamen bleiben fest im Code, nur die Sheet-Daten sind dynamisch.
const MERCH_STAND = {
  id: 'merch',
  name: 'Merch',
  location: 'Festivalgelände',
  icon: 'merch',
  description: 'Fruchtfolge zum Anziehen — direkt am Stand, solange der Vorrat reicht.',
  mapMarker: { area: 'festivalground', num: 9 },
}

const MERCH_PRODUCTS = [
  { key: 'shirt', name: 'Shirt', photo: 'Merch_Shirt.jpg' },
  { key: 'hoodie', name: 'Hoodie', photo: 'Merch_Hoodie.jpg' },
]

// Fallback-Items — sichtbar solange das Sheet noch lädt oder für den
// jeweiligen Stand (noch) keine Zeilen enthält.
const STANDS = [
  {
    id: 'food-stand',
    name: 'Feldküche',
    category: 'food',
    location: 'Festivalgelände',
    icon: 'feldkueche',
    mapMarker: { area: 'festivalground', num: 11 },
    hours: 'Fr 16–22 Uhr · Sa 12–22 Uhr',
    description: 'Frisch vom Grill und aus der Fritteuse — für alle was dabei.',
    items: [
      { name: 'Bratwurstsemmel', tags: ['FLEISCH', 'VEGGIE', 'VEGAN'] },
      { name: 'Hotdog', note: 'Röstzwiebeln, Pickles, Käse, Jalapeños', tags: ['FLEISCH'] },
      { name: 'Chilidog', note: '+ Chili sin Carne', tags: ['VEGAN'] },
      { name: 'Falafelsandwich', tags: ['VEGAN'] },
      { name: 'Pommes', tags: ['VEGAN'] },
      { name: 'Chili Cheese Fries', note: 'Chili sin Carne & Käse', tags: ['VEGGIE'] },
      { name: 'Maiskolben', tags: ['VEGAN'] },
      { name: 'Frisches Obst', tags: ['VEGAN'] },
    ],
    condiments: 'leckere Soßen von Münchner Kindl',
  },
  {
    id: 'bar',
    name: 'Festivalbar',
    category: 'drinks',
    location: 'Festivalgelände',
    icon: 'festivalbar',
    mapMarker: { area: 'festivalground', num: 10 },
    sheetTab: 'getraenke',
    description: 'Kalt, laut, gesellig — die Hauptbar des Festivals.',
    items: [
      { name: 'Leitungswasser', price: 0, tags: [] },
      { name: 'Pfeffi', price: 1, tags: [] },
      { name: 'Sprudelwasser', price: 2, tags: [] },
      { name: 'Spezi', price: 3, tags: [] },
      { name: 'Limo', price: 3, tags: [] },
      { name: 'Hopfenschorle', price: 3, tags: [] },
      { name: 'Club Mate', price: 3, tags: [] },
      { name: 'Radler', price: 3, tags: [] },
      { name: 'Alkoholfreies Bier', price: 3, tags: [] },
      { name: 'Helles', price: 4, tags: [] },
      { name: 'Weinschorle', price: 5, tags: [] },
      { name: 'Diskoschorle', price: 6, tags: [] },
      { name: 'Longdrinks', price: 7, tags: [] },
    ],
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar',
    category: 'drinks',
    location: 'Campingplatz',
    icon: 'zanzibar',
    mapMarker: { area: 'campground', num: 3 },
    description: 'Bring deine übrigen Schnapsflaschen von daheim mit und spende sie unserer Zanzibar — ausgeschenkt wird gegen eine frei gewählte Spende, was reinkommt bleibt im Festival.',
    highlight: true,
    items: [
      { name: 'Eigener Alkohol', note: 'Übrige Schnapsflaschen von Zuhause spenden', tags: [] },
      { name: 'Barkeeper-Magie', note: '1–2 Barkeeper mixen aus dem was da ist', tags: [] },
      { name: 'Softdrinks', note: 'Zukauf an der Festivalbar nötig', tags: [] },
    ],
    note: 'Softdrinks müssen an der Festivalbar dazugekauft werden. Für den Rest gilt: ihr entscheidet, was es euch wert ist. 🤘',
    // Zanzibar läuft nicht über das Preis-Sheet — BYO-Konzept, keine Verkaufspreise.
    sheetManaged: false,
  },
  {
    id: 'wahrsagerzelt',
    name: 'Wahrsagerzelt',
    category: 'attraction',
    location: 'Festivalgelände',
    icon: 'wahrsagerzelt',
    mapMarker: { area: 'festivalground', num: 1 },
    description: '',
    items: [],
  },
]

// ─── Sheet-Anbindung ───
function useEssen() {
  const [byStand, setByStand] = useState({})

  useEffect(() => {
    fetchEssen().then(setByStand)
    const id = setInterval(() => fetchEssen().then(setByStand), ESSEN_POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return byStand
}

function itemsForStand(stand, byStand, getraenkeItems) {
  if (stand.sheetManaged === false) return stand.items
  if (stand.sheetTab === 'getraenke') {
    return getraenkeItems.length > 0 ? getraenkeItems : stand.items
  }
  const sheetItems = byStand[stand.name]
  return sheetItems && sheetItems.length > 0 ? sheetItems : stand.items
}

// ─── Getränke Sheet-Anbindung (Festivalbar) ───
function useGetraenke() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchGetraenke().then(setItems)
    const id = setInterval(() => fetchGetraenke().then(setItems), GETRAENKE_POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return items
}

// ─── Merch Sheet-Anbindung ───
function useMerch() {
  const [bySize, setBySize] = useState({ hoodie: [], shirt: [] })

  useEffect(() => {
    fetchMerch().then(setBySize)
    const id = setInterval(() => fetchMerch().then(setBySize), MERCH_POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return bySize
}

function StandIcon({ type }) {
  if (type === 'feldkueche')  return <IconFeldkueche size={48} />
  if (type === 'festivalbar') return <IconFestivalbar size={48} />
  if (type === 'zanzibar')       return <IconZanzibar size={48} />
  if (type === 'wahrsagerzelt')  return <IconWahrsagerzelt size={48} />
  if (type === 'merch')          return <IconMerch size={48} />
  return null
}

// Standort-Pin: verlinkt zur Karte und lässt dort die passende Nummer aufleuchten,
// wenn der Stand einen Marker hat. Sonst reiner Text.
function StandLocation({ location, mapMarker }) {
  const navigate = useNavigate()

  if (!mapMarker) {
    return <span className="stand-location">📍 {location}</span>
  }

  return (
    <button
      className="stand-location stand-location--link"
      onClick={e => {
        e.stopPropagation()
        navigate(`/map?area=${mapMarker.area}&highlight=${mapMarker.num}`)
      }}
    >
      📍 {location}
    </button>
  )
}

function tagClass(tag) {
  if (tag === 'VEGAN')   return 'badge--vegan'
  if (tag === 'VEGGIE')  return 'badge--veggie'
  if (tag === 'FLEISCH') return 'badge--meat'
  return ''
}

function StandCard({ stand, items }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`card stand-card ${stand.highlight ? 'stand-card--highlight' : ''}`}>
      <div className="stand-header" onClick={() => setOpen(o => !o)}>
        <div className="stand-icon-wrap">
          <StandIcon type={stand.icon} />
        </div>
        <div className="stand-meta">
          <h2 className="stand-name">{stand.name}</h2>
          <StandLocation location={stand.location} mapMarker={stand.mapMarker} />
          {stand.hours && <span className="stand-hours">🕒 {stand.hours}</span>}
        </div>
        <span className={`stand-toggle ${open ? 'stand-toggle--open' : ''}`}>›</span>
      </div>

      {stand.description && <p className="stand-description">{stand.description}</p>}

      {open && (
        <div className="stand-items fade-in">
          <div className="stand-divider" />
          <ul className="stand-item-list">
            {items.map((item, i) => (
              <li key={item.id ?? i} className={`stand-item ${item.available === false ? 'stand-item--unavailable' : ''}`}>
                <div className="stand-item-left">
                  <span className="stand-item-name">{item.name}</span>
                  {item.note && <span className="stand-item-note">{item.note}</span>}
                </div>
                <div className="stand-item-right">
                  {formatPrice(item.price) && <span className="stand-item-price">{formatPrice(item.price)}</span>}
                  <div className="stand-item-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className={`badge ${tagClass(tag)}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {stand.condiments && <p className="stand-condiments">+ {stand.condiments}</p>}
          {stand.note       && <p className="stand-note">{stand.note}</p>}
        </div>
      )}
    </div>
  )
}

function Lightbox({ src, alt, onClose }) {
  // Portal direkt an document.body — sonst würde das fixed-positionierte Overlay
  // durch die transform-Animation von .screen.fade-in auf dessen Box begrenzt.
  return createPortal(
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Schließen">✕</button>
      <img src={src} alt={alt} className="lightbox-img" />
    </div>,
    document.body
  )
}

function MerchProduct({ product, sizes, onOpenPhoto }) {
  const price = sizes.find(s => s.price != null)?.price

  return (
    <div className="merch-product">
      <img
        src={asset(product.photo)}
        alt={product.name}
        className="merch-photo"
        loading="lazy"
        decoding="async"
        onClick={() => onOpenPhoto(asset(product.photo), product.name)}
      />
      <div className="merch-product-header">
        <span className="merch-product-name">{product.name}</span>
        {formatPrice(price) && <span className="merch-product-price">{formatPrice(price)}</span>}
      </div>
      {sizes.length > 0 ? (
        <div className="merch-sizes">
          {sizes.map(s => (
            <span key={s.size} className={`merch-size-chip ${s.soldOut ? 'merch-size-chip--soldout' : ''}`}>
              {s.size}
            </span>
          ))}
        </div>
      ) : (
        <p className="merch-sizes-empty">Größen &amp; Preise folgen in Kürze</p>
      )}
    </div>
  )
}

function MerchCard({ merchSizes }) {
  const [open, setOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  return (
    <div className="card stand-card">
      <div className="stand-header" onClick={() => setOpen(o => !o)}>
        <div className="stand-icon-wrap">
          <StandIcon type={MERCH_STAND.icon} />
        </div>
        <div className="stand-meta">
          <h2 className="stand-name">{MERCH_STAND.name}</h2>
          <StandLocation location={MERCH_STAND.location} mapMarker={MERCH_STAND.mapMarker} />
        </div>
        <span className={`stand-toggle ${open ? 'stand-toggle--open' : ''}`}>›</span>
      </div>

      <p className="stand-description">{MERCH_STAND.description}</p>

      {open && (
        <div className="stand-items fade-in">
          <div className="stand-divider" />
          <div className="merch-products">
            {MERCH_PRODUCTS.map(product => (
              <MerchProduct
                key={product.key}
                product={product}
                sizes={merchSizes[product.key] ?? []}
                onOpenPhoto={(src, alt) => setLightbox({ src, alt })}
              />
            ))}
          </div>
        </div>
      )}

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}

export default function FoodScreen() {
  const byStand = useEssen()
  const getraenkeItems = useGetraenke()
  const merchSizes = useMerch()

  return (
    <div className="screen food-screen fade-in">
      <h1 className="screen-title">STÄNDE</h1>
      <div className="screen-title-underline" />

      <div className="stand-list">
        {STANDS.map(stand => (
          <StandCard key={stand.id} stand={stand} items={itemsForStand(stand, byStand, getraenkeItems)} />
        ))}
        <MerchCard merchSizes={merchSizes} />
      </div>
    </div>
  )
}
