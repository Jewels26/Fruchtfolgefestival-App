import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { isStandalone } from './utils/standalone'

// Ein installiertes Homescreen-Icon wird beim Antippen oft nur aus dem
// Hintergrund reaktiviert statt neu geladen — dabei findet keine Navigation
// statt, die von sich aus einen Service-Worker-Update-Check auslösen würde.
// Wer die App einmal offen lässt, bekommt neue Deploys sonst erst nach einem
// echten Schließen+Neuöffnen. Deshalb hier ein eigener Check: alle 20 Minuten
// und jedes Mal, wenn die App wieder sichtbar wird. registerType: 'autoUpdate'
// (siehe vite.config.js) sorgt danach automatisch fürs Aktivieren + Neuladen,
// sobald ein Update gefunden wurde — hier wird nur öfter nachgeschaut.
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return
    const checkForUpdate = () => registration.update().catch(() => {})
    setInterval(checkForUpdate, 20 * 60 * 1000)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate()
    })
  },
})

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
