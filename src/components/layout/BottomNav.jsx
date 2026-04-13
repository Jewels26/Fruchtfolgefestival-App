import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const NAV_ITEMS = [
  { path: '/',       label: 'HOME',   icon: <HomeIcon /> },
  { path: '/lineup', label: 'LINEUP', icon: <LineupIcon /> },
  { path: '/map',    label: 'MAP',    icon: <MapIcon /> },
  { path: '/food',   label: 'FOOD',   icon: <FoodIcon /> },
  { path: '/info',   label: 'INFO',   icon: <InfoIcon /> },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item--active' : ''}`
            }
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// --- SVG Icons (Blueprint / Draughtsman Stil) ---

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}

function LineupIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 12h16M4 18h10"/>
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )
}

function FoodIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v6c0 2.2 1.8 4 4 4h0c2.2 0 4-1.8 4-4V3"/>
      <line x1="7" y1="13" x2="7" y2="21"/>
      <path d="M16 3c0 0 4 3 4 8h-4V3z"/>
      <line x1="18" y1="11" x2="18" y2="21"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="11" x2="12" y2="16"/>
    </svg>
  )
}
