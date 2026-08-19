import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { asset } from '../utils/assetPath'
import './MapScreen.css'

// ─── Kartenbereiche ───
// Koordinaten sind Pixel-Positionen im Koordinatensystem von width/height
// (nicht zwingend die tatsächliche Dateiauflösung — die PNGs sind fürs Laden
// verkleinert, width/height hier entsprechen der Auflösung, in der die
// Positionen ursprünglich abgelesen wurden; da nur gleichmäßig skaliert
// wurde, bleibt das Seitenverhältnis und damit die %-Umrechnung exakt).
// Marker-Nummern entsprechen jetzt direkt der Prioritätsreihenfolge (1 =
// wichtigstes zuerst) — die Deklarationsreihenfolge unten ist absichtlich
// diese Reihenfolge, nicht nach Position auf der Karte sortiert.
const AREAS = [
  {
    key: 'festivalground',
    label: 'Festivalgelände',
    image: 'Gelaendeplan_Festivalground.png',
    width: 1085,
    height: 809,
    markers: [
      { num: 2, name: 'Bühne', x: 594, y: 237 },
      { num: 3, name: 'Festivalbar', x: 492, y: 390 },
      { num: 4, name: 'Feldküche', x: 583, y: 448 },
      { num: 5, name: 'Erste Hilfe', x: 692, y: 565, danger: true },
      { num: 6, name: 'Toiletten Festivalgelände', x: 984, y: 376 },
      { num: 9, name: 'Chillout-Bereich', x: 738, y: 294 },
      { num: 11, name: 'Zanzibar', x: 635, y: 444 },
      { num: 13, name: 'Zaubererzelt', x: 775, y: 513 },
      // 10 und 12 sitzen jetzt an der Torstruktur, die frei wurde, nachdem der
      // Einlass (1) aufs Campingplatz-Bild gewandert ist.
      { num: 10, name: 'Fundsachen', x: 655, y: 540 },
      { num: 12, name: 'Merch', x: 730, y: 558 },
    ],
  },
  {
    key: 'campground',
    label: 'Campingplatz',
    image: 'Gelaendeplan_Campground.png',
    width: 1476,
    height: 831,
    markers: [
      { num: 8, name: 'Duschen / Spa-Bereich', x: 870, y: 124 },
      { num: 7, name: 'Toiletten Campingplatz', x: 606, y: 191 },
      { num: 1, name: 'Einlass Festivalgelände', x: 1117, y: 255 },
      { num: 14, id: 'campingflaeche-1', name: 'Campingflächen', x: 915, y: 233 },
      { num: 14, id: 'campingflaeche-2', name: 'Campingflächen', x: 1004, y: 457 },
      { num: 15, name: 'Parkplatz', x: 295, y: 598 },
    ],
  },
]

const ALL_MARKERS = AREAS.flatMap(area => area.markers.map(m => ({ ...m, area: area.key })))
// Bei mehreren Markern mit derselben Nummer (die drei Campingflächen)
// erscheint die Nummer nur einmal in der Legende.
const POI_LEGEND = [...new Map(ALL_MARKERS.map(m => [m.num, m])).values()]
  .sort((a, b) => a.num - b.num)

function MapMarker({ num, name, x, y, width, height, danger, highlighted, markerRef }) {
  return (
    <div
      ref={markerRef}
      className={`map-marker ${danger ? 'map-marker--danger' : ''} ${highlighted ? 'map-marker--highlighted' : ''}`}
      style={{ left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%` }}
      title={name}
    >
      {num}
    </div>
  )
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const DOUBLE_TAP_ZOOM = 2.5

function clampZoom(scale) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale))
}

// Vollbild-Ansicht der Karte mit Pinch-Zoom/Pan (Touch), Mausrad-Zoom und
// Doppelklick zum Rein-/Rauszoomen (Desktop). Kein neues Zoom-Gefühl à la
// Google Maps — einfaches Skalieren+Verschieben reicht hier völlig.
function MapLightbox({ area, onClose }) {
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const gestureRef = useRef(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [])

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      const [a, b] = e.touches
      gestureRef.current = {
        mode: 'pinch',
        startDist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        startScale: scale,
      }
    } else if (e.touches.length === 1 && scale > 1) {
      const t = e.touches[0]
      gestureRef.current = {
        mode: 'pan',
        startX: t.clientX,
        startY: t.clientY,
        startPosX: pos.x,
        startPosY: pos.y,
      }
    }
  }

  function handleTouchMove(e) {
    const g = gestureRef.current
    if (!g) return
    if (g.mode === 'pinch' && e.touches.length === 2) {
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      setScale(clampZoom(g.startScale * (dist / g.startDist)))
    } else if (g.mode === 'pan' && e.touches.length === 1) {
      const t = e.touches[0]
      setPos({
        x: g.startPosX + (t.clientX - g.startX),
        y: g.startPosY + (t.clientY - g.startY),
      })
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length === 0) gestureRef.current = null
    if (scale <= 1) setPos({ x: 0, y: 0 })
  }

  function handleWheel(e) {
    const next = clampZoom(scale - e.deltaY * 0.01)
    setScale(next)
    if (next <= 1) setPos({ x: 0, y: 0 })
  }

  function handleDoubleClick() {
    if (scale > 1) {
      setScale(1)
      setPos({ x: 0, y: 0 })
    } else {
      setScale(DOUBLE_TAP_ZOOM)
    }
  }

  return createPortal(
    <div className="map-lightbox">
      <button className="map-lightbox-close" onClick={onClose} aria-label="Schließen">✕</button>
      <div
        className="map-lightbox-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="map-lightbox-content"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        >
          <img
            src={asset(area.image)}
            alt={`Geländeplan ${area.label}`}
            className="map-lightbox-image"
            draggable={false}
          />
          {area.markers.map(m => (
            <MapMarker key={m.id ?? m.num} {...m} width={area.width} height={area.height} />
          ))}
        </div>
      </div>
      <p className="map-lightbox-hint">Zum Zoomen: Pinch (Handy) · Mausrad oder Doppelklick (Desktop)</p>
    </div>,
    document.body
  )
}

export default function MapScreen() {
  const [searchParams] = useSearchParams()
  const areaParam = searchParams.get('area')
  const highlightParam = searchParams.get('highlight')

  const [activeArea, setActiveArea] = useState(
    AREAS.some(a => a.key === areaParam) ? areaParam : AREAS[0].key
  )
  // Startet mit dem Deep-Link aus der URL (z.B. vom Stände-Tab), lässt sich
  // danach aber auch direkt per Klick auf die Nummern-Legende steuern.
  const [highlightNum, setHighlightNum] = useState(
    highlightParam ? Number(highlightParam) : null
  )
  const area = AREAS.find(a => a.key === activeArea)
  const highlightedMarkerRef = useRef(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (highlightedMarkerRef.current) {
      highlightedMarkerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeArea, highlightNum])

  function togglePoi(poi) {
    setActiveArea(poi.area)
    setHighlightNum(prev => (prev === poi.num ? null : poi.num))
  }

  return (
    <div className="screen map-screen fade-in">
      <h1 className="screen-title">KARTE</h1>
      <div className="screen-title-underline" />

      {/* Bereichs-Auswahl */}
      <div className="map-area-selector">
        {AREAS.map(a => (
          <button
            key={a.key}
            className={`map-area-btn ${activeArea === a.key ? 'map-area-btn--active' : ''}`}
            onClick={() => setActiveArea(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Karten-Bereich — antippen öffnet die zoombare Vollbild-Ansicht */}
      <div className="map-container" onClick={() => setLightboxOpen(true)}>
        <img
          src={asset(area.image)}
          alt={`Geländeplan ${area.label}`}
          className="map-image"
        />
        {area.markers.map(m => {
          const isHighlighted = m.num === highlightNum
          return (
            <MapMarker
              key={m.id ?? m.num}
              {...m}
              width={area.width}
              height={area.height}
              highlighted={isHighlighted}
              markerRef={isHighlighted ? highlightedMarkerRef : null}
            />
          )
        })}
        <span className="map-zoom-hint">🔍</span>
      </div>

      {lightboxOpen && (
        <MapLightbox area={area} onClose={() => setLightboxOpen(false)} />
      )}

      {/* Farb-Legende — neues Kartenrender ist grau/weiß, nur Grün kommt noch vor (Notausgänge) */}
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--exit" />
          <span>Fluchtwege</span>
        </div>
      </div>

      {/* Nummern-Legende */}
      <div className="map-poi-legend">
        {POI_LEGEND.map(poi => (
          <button
            key={poi.num}
            className={`map-poi-item ${poi.num === highlightNum ? 'map-poi-item--highlighted' : ''}`}
            onClick={() => togglePoi(poi)}
          >
            <span className={`map-poi-num ${poi.danger ? 'map-poi-num--danger' : ''}`}>
              {poi.num}
            </span>
            <span className="map-poi-name">{poi.name}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
