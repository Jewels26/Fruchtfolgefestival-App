import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Standard: Root — passt für Netlify & Co. Für GitHub Pages überschreibt
  // der "deploy"-Skript-Aufruf das per --base=/Fruchtfolgefestival-App/.
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        lang: 'de',
        name: 'Fruchtfolgefestival',
        short_name: 'FFF',
        description: 'Line-up, Zeitplan und Infos zum Fruchtfolgefestival',
        theme_color: '#010101',
        background_color: '#010101',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Bandfotos sind teils mehrere MB groß und wechseln öfter -> nicht vorab cachen,
        // sondern erst beim Betrachten (runtimeCaching unten).
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        globIgnores: ['bands/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/bands/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'band-photos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})


