// ─── FFF Food Icons ───
import { asset } from '../utils/assetPath'

const S = {
  fill: 'none',
  stroke: '#1BFE00',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconFeldkueche({ size = 48 }) {
  return (
    <img
      src={asset('Icon Feldkueche.png')}
      alt="Feldküche"
      width={size}
      height={size}
      style={{ objectFit: 'cover', display: 'block' }}
    />
  )
}

export function IconFestivalbar({ size = 48 }) {
  return (
    <img
      src={asset('Icon Festivalbar.png')}
      alt="Festivalbar"
      width={size}
      height={size}
      style={{ objectFit: 'cover', display: 'block' }}
    />
  )
}

// Sansibar: Cocktailglas mit Strohhalm und Kirsche
export function IconSansibar({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glasränder */}
      <path d="M11 16 L47 76 L47 90" {...S} strokeLinejoin="round" />
      <path d="M89 16 L53 76 L53 90" {...S} strokeLinejoin="round" />
      {/* Oberer Rand */}
      <line x1="9" y1="16" x2="91" y2="16" {...S} />
      {/* Fuß */}
      <line x1="33" y1="90" x2="67" y2="90" {...S} />
      {/* Flüssigkeitslinie */}
      <path d="M19 32 Q50 42 81 32" {...S} strokeWidth={1.3} />
      {/* Strohhalm */}
      <line x1="64" y1="8" x2="50" y2="76" {...S} strokeWidth={2.2} />
      {/* Kirsche */}
      <circle cx="68" cy="14" r="7" {...S} />
      {/* Kirschstiel */}
      <path d="M68 7 Q72 3 76 7" {...S} strokeWidth={1.5} />
    </svg>
  )
}

// Kassette: Kassettenband
export function IconKassette({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Kassettenkörper */}
      <rect x="4" y="16" width="92" height="68" rx="7" {...S} />
      {/* Linke Spule */}
      <circle cx="30" cy="50" r="15" {...S} />
      <circle cx="30" cy="50" r="5" {...S} />
      {/* Rechte Spule */}
      <circle cx="70" cy="50" r="15" {...S} />
      <circle cx="70" cy="50" r="5" {...S} />
      {/* Bandfenster (unten mitte) */}
      <rect x="41" y="67" width="18" height="12" rx="3" {...S} strokeWidth={1.5} />
      {/* Etikett-Linie oben */}
      <line x1="4"  y1="28" x2="41" y2="28" {...S} strokeWidth={1.2} />
      <line x1="59" y1="28" x2="96" y2="28" {...S} strokeWidth={1.2} />
    </svg>
  )
}
