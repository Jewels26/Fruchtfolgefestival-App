import { useState } from 'react'
import { asset } from '../utils/assetPath'
import './MapScreen.css'

// ─── Kartenbereiche ───
// Koordinaten sind Pixel-Positionen auf dem jeweiligen Original-PNG,
// werden unten in % umgerechnet (responsive, unabhängig von Anzeigegröße).
const AREAS = [
  {
    key: 'festivalground',
    label: 'Festivalground',
    image: 'Gelaendeplan_Festivalground.png',
    width: 963,
    height: 689,
    markers: [
      { num: 1, name: 'Wahrsagerzelt', x: 565, y: 475 },
      { num: 2, name: 'Lost & Found', x: 250, y: 375 },
      { num: 5, name: 'Festivalground Access', x: 460, y: 600 },
      { num: 6, name: 'Chill Out Area', x: 568, y: 264 },
      { num: 8, name: 'First Aid', x: 285, y: 375, danger: true },
      { num: 9, name: 'Merch', x: 497, y: 203 },
    ],
  },
  {
    key: 'campground',
    label: 'Campground',
    image: 'Gelaendeplan_Campground.png',
    width: 925,
    height: 553,
    markers: [
      { num: 3, name: 'Sansibar', x: 300, y: 200 },
      { num: 4, name: 'Campground Access', x: 18, y: 102 },
      { num: 7, name: 'Duschen / Spa-Bereich', x: 300, y: 55 },
    ],
  },
]

const POI_LEGEND = AREAS
  .flatMap(area => area.markers)
  .sort((a, b) => a.num - b.num)

function MapMarker({ num, name, x, y, width, height, danger }) {
  return (
    <div
      className={`map-marker ${danger ? 'map-marker--danger' : ''}`}
      style={{ left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%` }}
      title={name}
    >
      {num}
    </div>
  )
}

export default function MapScreen() {
  const [activeArea, setActiveArea] = useState(AREAS[0].key)
  const area = AREAS.find(a => a.key === activeArea)

  return (
    <div className="screen map-screen fade-in">
      <h1 className="screen-title">MAP</h1>
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
        {area.markers.map(m => (
          <MapMarker key={m.num} {...m} width={area.width} height={area.height} />
        ))}
      </div>

      {/* Farb-Legende */}
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--stage" />
          <span>Stage</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--food" />
          <span>Food</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--drinks" />
          <span>Drinks</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--toilet" />
          <span>Toiletten</span>
        </div>
      </div>

      {/* Nummern-Legende */}
      <div className="map-poi-legend">
        {POI_LEGEND.map(poi => (
          <div key={poi.num} className="map-poi-item">
            <span className={`map-poi-num ${poi.danger ? 'map-poi-num--danger' : ''}`}>
              {poi.num}
            </span>
            <span className="map-poi-name">{poi.name}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
