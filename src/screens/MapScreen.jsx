import './MapScreen.css'

// ─── MAP SCREEN ───
// Aktuell: Placeholder bis CAD-Export (PNG) von maZe/Wascht geliefert wird
// Dann: <img src="/map.png" alt="Geländeplan" className="map-image" /> einsetzen

export default function MapScreen() {
  return (
    <div className="screen map-screen fade-in">
      <h1 className="screen-title">MAP</h1>
      <div className="screen-title-underline" />

      {/* Karten-Bereich — Placeholder bis PNG vorhanden */}
      <div className="map-container">

        {/* Sobald PNG vorhanden: diese Zeile einkommentieren und Placeholder-Block entfernen */}
        {/* <img src="/map.png" alt="Geländeplan Fruchtfolgefestival" className="map-image" /> */}

        <div className="map-placeholder">
          <span className="map-placeholder-icon">🗺</span>
          <p className="map-placeholder-title">GELÄNDEPLAN</p>
          <p className="map-placeholder-text">
            Karte folgt — CAD-Export von maZe & Wascht ausstehend.
          </p>
          <p className="map-placeholder-hint">
            PNG in <code>public/map.png</code> ablegen,<br />
            dann die auskommentierte Zeile im Code aktivieren.
          </p>
        </div>

      </div>

      {/* Legende */}
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
          <span className="map-legend-dot map-legend-dot--toilet" />
          <span>Toiletten</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot map-legend-dot--aid" />
          <span>First Aid</span>
        </div>
      </div>

      {/* Area Intelligence — wie im Figma */}
      <div className="card map-intel-card">
        <p className="map-intel-label">AREA INTELLIGENCE</p>
        <p className="map-intel-text">
          Geländeplan wird vor dem Festival aktualisiert. Alle Bereiche,
          Zugänge und Notausgänge werden hier sichtbar sein.
        </p>
      </div>

    </div>
  )
}
