# Fruchtfolgefestival App 🌾

Die offizielle Begleiter-App für das **Fruchtfolgefestival** — ein kleines, ehrenamtlich organisiertes Musikfestival auf einem Bauernhof in Lindach bei Fürstenfeldbruck. Die App läuft als Web-App direkt im Browser und begleitet Besucher*innen vor und während des Festivals: Lineup, Gelände, Essen & Trinken, wichtige Infos — und einen Chat-Assistenten mit eigenem Charakter.

**Live:** https://Jewels26.github.io/Fruchtfolgefestival-App

## Was die App kann

- **Home** — Countdown bis zum Einlass, aktueller Festival-Status (bevorstehend / läuft / vorbei), Live-Wetter für die Festivaltage und Ankündigungen der Veranstalter.
- **Lineup** — Bandübersicht nach Festivaltag, mit Fotos, Genre, Herkunft und Spielzeiten. Favoriten lassen sich per Herz markieren (lokal gespeichert). Ein „Late Night Special“-Slot bleibt bis zuletzt geheim.
- **Map** — Geländeplan mit Legende (Bühne, Essen, Toiletten, Erste Hilfe); aktuell als Platzhalter bis der finale CAD-Export vorliegt.
- **Food & Drinks** — Alle Stände (Feldküche, Festivalbar, Zanzibar, Kassette) inklusive Speisekarte, veganen/vegetarischen Kennzeichnungen und Beschreibungen.
- **Info** — Notfallnummer, Öffnungszeiten, Ticket- und Feedback-Links, Verhaltenskodex des Festivals, ein Lost & Found sowie ein Spenden-Hinweis.
- **Patrick** 🤖 — ein Chatbot-Maskottchen im niederbayerischen Dialekt, das Fragen zu Anreise, Bands, Essen, Wetter, Camping, Sicherheit und Festival-Insidern über ein keyword-basiertes Antwortsystem beantwortet. Er meldet sich außerdem automatisch kurz vor Bandauftritten und bei neuen Ankündigungen.

## Technik im Überblick

- **React 19** + **React Router 7** (SPA mit Client-Side-Routing, eigener Basename für GitHub Pages)
- **Vite** als Build-Tool und Dev-Server
- Kein eigenes Backend: Ankündigungen und Fundsachen werden aus einem **Google Sheet** per CSV-Export geladen und alle 2 Minuten neu abgerufen
- Live-Wetterdaten über die kostenlose **Open-Meteo API**
- Favoriten und Theme-Einstellung werden in `localStorage` gehalten
- Deployment auf **GitHub Pages** via `gh-pages`

## Projektstruktur

```
src/
├── components/
│   ├── layout/     # AppShell, Header, BottomNav, NowPlayingBar
│   └── ui/         # Patrick (Chat-Widget)
├── context/        # ThemeContext, PatrickContext
├── data/           # Lineup-Daten
├── screens/        # Home, Lineup, Map, Food, Info
├── styles/         # Design-Tokens & globale Styles
└── utils/          # Google-Sheet-Fetcher, Wetter-Store, Patrick-Antwort-Logik
```

## Entwicklung

```bash
npm install       # Abhängigkeiten installieren
npm run dev        # lokalen Dev-Server starten
npm run build       # Produktions-Build erzeugen
npm run lint        # ESLint ausführen
npm run deploy       # Build nach GitHub Pages veröffentlichen
```

## Über das Festival

Das Fruchtfolgefestival wird vom gemeinnützigen Verein **Fruchtfolgefestival Förderfreunde e.V.** komplett ehrenamtlich organisiert. Jedes Jahr steht eine andere landwirtschaftliche Fruchtfolge im Fokus, die sich auch im Festival-Logo widerspiegelt — 2026 ist es Klee. Das Festival versteht sich explizit als offener, diskriminierungsfreier Ort für Vielfalt.
