import { useTheme } from '../../context/ThemeContext'
import { asset } from '../../utils/assetPath'
import './Header.css'

function LogoMark() {
  return (
    <img src={asset('minilogo_wurzel.png')} alt="FFF" className="logo-mark" />
  )
}

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-inner">
        <LogoMark />

        <div className="header-title">
          <span className="header-title-text">FRUCHTFOLGE</span>
          <span className="header-title-text">FESTIVAL</span>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <LogoMark />
        </div>
      </div>
    </header>
  )
}
