# FFF-App — Übergabe-Dokument für neue Chat-Sessions
> Fruchtfolge Festival App · Stand: April 2026 · Jewels + Claude

---

## Projekt-Überblick

PWA (Progressive Web App) für das Fruchtfolge Festival — kleines regionales Rock/Alternative/Metal-Festival auf einem Bauernhof, Ende August. Die App begleitet Besucher vor Ort mit Lineup, Geländeplan und Live-Infos.

**Stack:** React + Vite · CSS Custom Properties · GitHub Pages (Entwicklung) → Netlify (Launch)  
**Repo:** https://github.com/Jewels26/Fruchtfolgefestival-App  
**Live:** https://Jewels26.github.io/Fruchtfolgefestival-App/

---

## Projektstruktur

```
FFF-APP/
├── public/                  # Statische Assets (Bilder, Icons, Hintergrundtexturen)
│   └── bands/               # Bandfotos (z.B. BandName.jpg)
├── src/
│   ├── assets/              # Import-basierte Assets (selten genutzt)
│   ├── components/
│   │   ├── layout/          # Globale Layout-Komponenten
│   │   │   ├── AppShell.jsx         # Wrapper: Header + BottomNav + NowPlayingBar
│   │   │   ├── BottomNav.jsx/css    # 5-Tab Navigation (Home · Lineup · Map · Food · Info)
│   │   │   ├── Header.jsx/css       # App-Header mit Logo + Theme-Toggle
│   │   │   └── NowPlayingBar.jsx/css # Fixe Leiste über Nav, zeigt aktuellen Act
│   │   └── ui/
│   │       └── Patrick.jsx/css      # Schwebender Assistent-Button + Chat-Overlay
│   ├── context/
│   │   └── ThemeContext.jsx         # Dark/Light Mode Toggle (data-theme Attribut auf <html>)
│   ├── data/                # Alle Inhalte als JS-Objekte (kein Backend)
│   │   └── lineup.js        # Bands mit Zeiten, Fotos, Genre-Tags
│   ├── screens/             # Je ein Screen = eine Route
│   │   ├── HomeScreen.jsx/css       # Countdown, Wetter-Widget, Ankündigungen
│   │   ├── LineupScreen.jsx/css     # Timetable mit Day-Selector
│   │   ├── MapScreen.jsx/css        # Statisches Bild (PNG/PDF-Export aus CAD)
│   │   ├── FoodScreen.jsx/css       # Essensstände mit aufklappbaren Karten
│   │   └── InfoScreen.jsx/css       # Notfall, Sanitär, Öffnungszeiten, Regeln
│   ├── styles/              # Globale Styles
│   │   ├── tokens.css       # ⭐ DESIGN TOKENS — alle CSS-Variablen, hier zuerst schauen
│   │   └── global.css       # Reset, .card, .badge, .btn, .screen, Animationen
│   ├── utils/
│   │   └── assetPath.js     # asset('datei.png') — korrekte Pfade für GitHub Pages
│   ├── App.jsx              # Router-Setup + ThemeProvider
│   ├── App.css              # ⚠️ Vite-Boilerplate — leer, ignorieren
│   ├── index.css            # ⚠️ Vite-Boilerplate — leer, ignorieren
│   └── main.jsx             # React-Einstiegspunkt
├── vite.config.js           # base: '/Fruchtfolgefestival-App/'
└── package.json             # deploy: gh-pages -d dist
```

---

## Design System — Kurzreferenz

**Vibe:** Gothic Farm Metal — dunkel, rau, neon-elektrisch.

### Die wichtigsten CSS-Variablen (aus `src/styles/tokens.css`)

| Variable | Dark Mode | Light Mode | Verwendung |
|---|---|---|---|
| `--color-bg` | `#010101` | `#F4F4F4` | App-Hintergrund |
| `--color-bg-card` | `#010101` | `#F4F4F4` | Card-Hintergrund |
| `--color-surface-raised` | `#1a2e1a` | `#dde8dd` | Icon-Wraps, eingebettete Elemente |
| `--color-accent` | `#1BFE00` | `#1BFE00` | Neon Green — Borders, CTAs, aktive Icons |
| `--color-accent-dim` | `#1BFE0033` | — | Gedimmtes Green für Border-Tops |
| `--color-heading` | `#B62AB5` | `#BD4688` | Screen-Titel, Band-Namen |
| `--color-body` | `#a8b8a8` | `#2a3a2a` | Fließtext |
| `--color-label` | `#A5A23C` | `#3A6237` | Zeiten, Bühnen, inaktive Nav-Icons |
| `--color-patrick` | `#C69BEB` | — | Soft Purple — Patrick, Highlights |
| `--border-card` | `1.5px solid #1BFE00` | `1.5px solid #3A6237` | Alle Cards |
| `--shadow-card` | `0 0 8px #1BFE0066` | `0 0 8px #1BFE0044` | Card Glow |

### Fonts
| Variable | Font | Verwendung |
|---|---|---|
| `--font-display` | Metal Mania | Screen-Titel (LINEUP, INFO …) |
| `--font-heading` | Bebas Neue | Band-/Stand-Namen auf Cards |
| `--font-body` | DM Sans | Alles andere |

### Globale Klassen (aus `src/styles/global.css`)
- `.card` — Standard-Card mit Border + Glow
- `.badge` — kleines Tag-Pill (Varianten: `.badge--vegan`, `.badge--veggie`, `.badge--meat`)
- `.btn` — Button (aktiv-State: `.active`)
- `.screen` — Screen-Wrapper mit korrektem Padding (Header + Nav + NowPlayingBar)
- `.fade-in` — Einblend-Animation
- `.pulse-dot` — pulsierender grüner Dot (Now Playing)

### Theme-System
Theme wird per `data-theme="dark"` / `data-theme="light"` auf `<html>` gesetzt.  
Steuerung über `ThemeContext.jsx` (`useTheme()` Hook, Toggle in Header).  
Dark Mode ist Standard. Gespeichert in `localStorage` unter `fff-theme`.

---

## Screens & Besonderheiten

### HomeScreen
Countdown bis Festival-Start, Wetter-Widget (API), Ankündigungen-Liste.

### LineupScreen
Bands aus `src/data/lineup.js`. Fotos aus `public/bands/` — immer über `asset()` einbinden.  
Struktur je Band: `{ name, time, stage, genre, photo, tags }`.

### MapScreen
Statisches Bild, noch kein endgültiger Geländeplan (Platzhalter).

### FoodScreen
Drei Stände als aufklappbare Cards. Inhalte direkt in der Komponente (`STANDS`-Array).  
Kein Filter (bei 3 Ständen nicht sinnvoll). Tags: FLEISCH · VEGGIE · VEGAN.

### InfoScreen
Notfallkontakte, Sanitär, Öffnungszeiten, Regeln.

### Patrick (ui-Komponente)
Schwebender Button unten rechts, öffnet Chat-Overlay.  
v1: regelbasiert (hardcoded Antworten).  
v2 (geplant): echter KI-Assistent via Claude API.

---

## Deployment

```bash
# Änderungen live schalten
npm run build
npm run deploy

# Source-Code sichern (empfohlen)
git add .
git commit -m "Beschreibung"
git push origin main
```

**Bilder einbinden — immer `asset()` verwenden, nie absolute Pfade:**
```jsx
import { asset } from '../utils/assetPath'
<img src={asset('bands/BandName.jpg')} />
```

---

## Offene TODOs (Stand April 2026)

- [ ] Endgültiger Geländeplan (PNG von maZe/Wascht) einbauen
- [ ] Lineup-Daten von Organisatoren einpflegen
- [ ] Essen-Konzept finalisieren und FoodScreen aktualisieren
- [ ] App.css + index.css bereinigen (Vite-Boilerplate löschen)
- [ ] FFF_App_Design_System_final.md in docs/ verschieben
- [ ] Patrick v1 Antworten ausbauen

---

*Erstellt mit Claude · Fruchtfolge Festival App · April 2026*
