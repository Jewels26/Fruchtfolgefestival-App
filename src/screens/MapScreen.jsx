import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { asset } from '../utils/assetPath'
import './MapScreen.css'

// ─── Kartenbereiche ───
// Koordinaten sind Pixel-Positionen auf dem jeweiligen Original-PNG,
// werden unten in % umgerechnet (responsive, unabhängig von Anzeigegröße).
const AREAS = [
  {
    key: 'festivalground',
    label: 'Festivalgelände',
    image: 'Gelaendeplan_Festivalground.png',
    width: 963,
    height: 689,
    markers: [
      { num: 1, name: 'Wahrsagerzelt', x: 565, y: 475 },
      { num: 2, name: 'Fundsachen', x: 318, y: 570 },
      { num: 5, name: 'Einlass Festivalgelände', x: 460, y: 600 },
      { num: 6, name: 'Chillout-Bereich', x: 568, y: 264 },
      { num: 8, name: 'Erste Hilfe', x: 352, y: 570, danger: true },
      { num: 9, name: 'Merch', x: 497, y: 203 },
      { num: 10, name: 'Festivalbar', x: 182, y: 382 },
      { num: 11, name: 'Feldküche', x: 284, y: 462 },
    ],
  },
  {
    key: 'campground',
    label: 'Campingplatz',
    image: 'Gelaendeplan_Campground.png',
    width: 925,
    height: 553,
    markers: [
      { num: 3, name: 'Zanzibar', x: 300, y: 200 },
      { num: 4, name: 'Einlass Campingplatz', x: 18, y: 102 },
      { num: 7, name: 'Duschen / Spa-Bereich', x: 300, y: 55 },
    ],
  },
]

const POI_LEGEND = AREAS
  .flatMap(area => area.markers.map(m => ({ ...m, area: area.key })))
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

      {/* Karten-Bereich */}
      <div className="map-container">
        <img
          src={asset(area.image)}
          alt={`Geländeplan ${area.label}`}
          className="map-image"
        />
        {area.markers.map(m => {
          const isHighlighted = m.num === highlightNum
          return (
            <MapMarker
              key={m.num}
              {...m}
              width={area.width}
              height={area.height}
              highlighted={isHighlighted}
              markerRef={isHighlighted ? highlightedMarkerRef : null}
            />
          )
        })}
      </div>

      {/* Farb-Legende */}
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--stage" />
          <span>Bühne</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--food" />
          <span>Essen</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--drinks" />
          <span>Getränke</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--toilet" />
          <span>Toiletten</span>
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
