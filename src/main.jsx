import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { isStandalone } from './utils/standalone'

// Zaehlt (grob) PWA-Installationen ueber GoatCounter, ohne Cookies/Pageview-Tracking.
window.addEventListener('appinstalled', () => {
  window.goatcounter?.count({
    path: 'pwa-install',
    title: 'PWA installiert',
    event: true,
  })
})

// iOS feuert kein 'appinstalled'. Als Naeherung: erster Start im Standalone-Modus
// (= ueber Home-Bildschirm-Icon geoeffnet) zaehlt als Install, einmal pro Geraet.
if (isStandalone() && !localStorage.getItem('pwa-standalone-counted')) {
  localStorage.setItem('pwa-standalone-counted', '1')
  window.goatcounter?.count({
    path: 'pwa-install-standalone',
    title: 'PWA installiert (Standalone erkannt)',
    event: true,
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
