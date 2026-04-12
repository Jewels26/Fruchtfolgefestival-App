# FFF_App_Design_System

# Fruchtfolge Festival App — Design System

> Übergabe-Dokument für neue Chat-Sessions · Stand: April 2026 · Erstellt von Jewels + Claude
> **Status:** Stitch ✅ · Figma ✅ · React — bereit zum Start 🚀

---

## Projekt-Kontext

**Festival:** Fruchtfolge Festival — kleines regionales Rock/Alternative/Metal-Festival auf einem Bauernhof.
**Datum:** 28. August – 30. August (Jahr von Organisatoren bestätigen)
**App-Typ:** PWA (Progressive Web App), React Multi-File, Deployment via Netlify.
**Design-Workflow:** Stitch ✅ → Figma ✅ → React (nächster Schritt)

---

## App-Screens (Struktur)

| # | Screen | Inhalt |
|---|--------|--------|
| 1 | **Home** | Countdown bis Festival-Start, Wetter-Widget, Ankündigungen |
| 2 | **Lineup / Timetable** | Alle Bands mit Zeiten, Day-Selector, **Hero Cards mit Bandfoto** |
| 3 | **Geländeplan** | Statisches Bild (PNG/PDF-Export aus CAD) |
| 4 | **Infos** | Notfall, Sanitär, Öffnungszeiten, Regeln |
| 5 | **Essen & Getränke** | Standübersicht mit Filter |

**Globale Elemente (kein eigener Screen):**
- **Now Playing Bar** — fixe Leiste über der Navigation, auf allen Screens sichtbar (außer Home vor Festival-Start). Zeigt: Band · Bühne · Uhrzeit · pulsierender Dot.
- **Patrick** — schwebender Float-Button (unten rechts), öffnet Chat-Overlay. Auf allen Screens präsent.
- **Light/Dark Mode Toggle** — manuell schaltbar, Sonne-Icon im Header. Kein Auto-Switch.

---

## Festival-Daten (bereits bekannt)

- **Datum:** 28. August – 30. August
- **Bandnamen:** vorhanden (von Organisatoren übergeben)
- **Timetable:** erster Draft vorhanden (von Organisatoren übergeben)
- **Konkretes Jahr:** → bei Organisatoren bestätigen

---

## Design-Vibe

**Konzept:** *Feral Farmhouse — Gothic Farm Metal*

Dunkle, raue Energie. Wie ein Metalkonzert in einer verfallenden Scheune. Schwarze Basis mit neon-elektrischen Akzenten. Anker sind das Logo mit seinen organischen Ranken/Wurzel-Motiven, kombiniert mit industriell-mechanischen Elementen.

**Logo:** Handgezeichnetes FF-Klee-und-Wurzel-Motiv, mehrfarbig (Olivgrün + Dunkelbraun). Als SVG vorhanden. Sitzt rechts im Header, links Hamburger-Menü.

**Hintergrund-Textur:** Auf allen Screens liegt eine semitransparente Textur-PNG (Holzplanken + Stahlplatten + Ranken, RGBA) zwischen dem schwarzen Grund-Layer und den UI-Elementen. Datei: `fff_background_texture.png` (390×1180px).

---

## Farbpalette

### Dark Mode (Standard)

| Rolle | Farbe | Hex |
|-------|-------|-----|
| **Background** | Deep Black | `#010101` |
| **Active Accent / CTA / Glow** | Neon Green | `#1BFE00` |
| **Primary Heading / Artist Names** | Neon Magenta | `#B62AB5` |
| **Secondary Highlight / Patrick** | Soft Purple | `#C69BEB` |
| **Tertiary Accent** | Deep Magenta | `#BD4688` |
| **Body / Detail Text** | Aged Gold-Bronze | `#A5A23C` |
| **Secondary Labels** | Dark Forest Green | `#3A6237` |
| **Card Background** | Dark Charcoal | `#141414` |

### Light Mode (Outdoor / Sonnig) — manuell per Toggle

| Rolle | Dark Mode | Light Mode |
|-------|-----------|------------|
| Background | `#010101` | `#1a1a1a` |
| Card Background | `#141414` | `#2a2a2a` |
| Body Text | `#A5A23C` | `#F0E080` |
| Active Accent | `#1BFE00` | `#1BFE00` |
| Primary Heading | `#B62AB5` | `#E040E0` |
| Secondary Highlight | `#C69BEB` | `#D8AEFF` |

**Toggle:** Sonne-Icon im Header, State per React Context global verfügbar.

---

## Typografie

| Ebene | Stil | Google Font Vorschlag |
|-------|------|-----------------------|
| **Screen-Titel / Headlines** | Distressed Gothic Serif | Metal Mania oder Creepster |
| **Artist Names** | Bold Condensed Gothic | Bebas Neue |
| **Body / Labels / Nav** | Sharp Industrial Sans | Inter oder DM Sans |

---

## UI-Elemente

### Cards (Standard)

- Base: `#141414`
- Border: 1.5px solid `#1BFE00` + `box-shadow: 0 0 6px #1BFE0066`
- Artist Name: Bold, `#B62AB5`
- Details (Zeit, Bühne): `#A5A23C`
- Genre-Badge: Pill, `#1a2e1a` Background, `#1BFE00` Text

### Artist Hero Cards (Lineup-Screen) ⚠️ WICHTIG

Lineup verwendet **Hero Card Format** — kein kleines Icon links, sondern Bandfoto oben.

- **Foto-Bereich:** Querformat-Bild oben, Höhe ca. 160–180px, volle Card-Breite. Dunkler Gradient-Overlay unten für Lesbarkeit.
- **Info-Bereich darunter** (Padding 12px):
  - Artist Name: Bold, `#B62AB5`, groß
  - Zeit + Bühne: `#A5A23C`
  - Genre-Badge: Pill `#1a2e1a` / `#1BFE00`
  - Favoriten-Herz rechts: `#A5A23C` inaktiv / `#C69BEB` aktiv
- **Fallback ohne Foto:** `#1a1a1a` Placeholder mit zentriertem Neongrün-Icon
- **Scroll:** Nur 2–3 Cards gleichzeitig sichtbar — gewollt, jede Band bekommt Präsenz

### Navigation Bar (Bottom)

- Background: `#0d0d0d`
- Icons: Blueprint / Draughtsman Linienstil
- Aktiv: `#1BFE00` + `filter: drop-shadow(0 0 4px #1BFE00)`
- Inaktiv: `#A5A23C`
- 5 Tabs: Home · Lineup · Map · Food · Info

### Now Playing Bar

- Background: `#111111`, Border-Top: `#1BFE0033`
- Pulsierender Dot: `#1BFE00` mit CSS-Animation
- Label "NOW PLAYING": `#A5A23C` small caps
- Band-Name: `#ffffff` bold
- Bühne: `#A5A23C`
- Nur sichtbar während Festival läuft (28.–30. August)

### Header

- Background: `#0d0d0d`
- Links: Hamburger-Icon `#A5A23C`
- Rechts: Logo SVG (mehrfarbig, Olivgrün + Braun)
- Sonne-Toggle-Icon für Light/Dark Mode (neben Logo oder Hamburger)

### Patrick (Assistent)

- Float-Button: Rund ~56px, `#C69BEB` Background + soft purple glow, schwarzes Icon
- Chat-Overlay: Dark Card, `#C69BEB` Akzent-Border
- v1: Regelbasiert (Antworten hard-coded)
- v2 Nice-to-have: Claude API

### Emergency Card (Info-Screen)

- Border: 1.5px crimson/rot statt grün
- Background: `#1a0a0a`
- Nummer groß in `#ffffff`, Label in `#ff3333`

---

## Hintergrund-Textur

Datei `fff_background_texture.png` (390×1180px, RGBA) auf allen Screens:
- Layer-Reihenfolge: `#010101` Grund → Textur (ca. 40% Deckkraft) → UI-Elemente
- Blending Mode: Multiply oder Normal je nach Screen
- Enthält: Holzplanken, Stahlplatten, Ranken, Ghost-Highlights, Risse

---

## Countdown-Logik

- Festival: **28. August – 30. August** (Jahr bestätigen)
- Vor Festival-Start: Countdown läuft auf Tore-Öffnung (28. August, Uhrzeit → Organisatoren)
- Während Festival: Now Playing Bar aktiv, kein Countdown auf Home
- Nach Festival: App zeigt "See you next year" State

---

## ⚠️ Offene Fragen an Organisatoren

### Kritisch — ohne diese Infos kann der Code nicht fertig werden

1. **Festival-Jahr** — 28. August bis 30. August welchen Jahres?
2. **Tore-Öffnung Uhrzeit** — wann genau am 28. August öffnen die Gates? (Countdown-Ziel)
3. **Finale Bandliste mit Timetable** — Bands, Tage, Uhrzeiten, Bühnen (Draft vorhanden, finale Version?)
4. **Bühnennamen** — wie heißen die Bühnen offiziell?
5. **Bandfotos** — für Hero Cards im Lineup. Format: Querformat, mind. 800×400px. Pro Band ein Foto. Wer liefert, bis wann?
6. **Notfallnummer** — die offizielle Nummer für den Info-Screen
7. **Geländeplan** — CAD-Export als PNG oder PDF. Wer liefert, bis wann?

### Wichtig — beeinflusst Funktionsumfang

8. **Essen & Getränke Stände** — Namen, Beschreibungen, Dietary Tags (Vegan/GF/Bio) der Stände
9. **Info-Screen Texte** — Öffnungszeiten, Toiletten-Info, Regeln, Lost & Found — wer schreibt diese?
10. **Ankündigungen** — wer pflegt die Announcements auf dem Home Screen? Brauchen wir ein einfaches CMS oder reicht hard-coded für v1?
11. **Patrick-Inhalte** — welche Fragen soll Patrick beantworten? (Liste der häufigsten Festival-Fragen zusammenstellen)

### Nice-to-have — für spätere Iterationen

12. **Wetter-API** — live gezogen oder Placeholder für v1?
13. **Favoriten-Funktion** im Lineup — v1 oder v2?
14. **Sprache** — nur Deutsch, oder auch Englisch?

---

## Nächste Schritte (Coding-Phase)

- [ ] Offene Fragen mit Organisatoren klären
- [ ] Bandfotos für Hero Cards einsammeln
- [ ] React-Projekt aufsetzen (Vite + PWA Plugin, Netlify)
- [ ] Design System als CSS Custom Properties anlegen
- [ ] Screen 1: Home (Countdown, Wetter-Placeholder, Announcements)
- [ ] Screen 2: Lineup mit Hero Cards + Day-Selector
- [ ] Screen 3: Map (statisches Bild einbinden)
- [ ] Screen 4: Info
- [ ] Screen 5: Food & Drinks
- [ ] Globale Elemente: Now Playing Bar, Patrick, Nav, Header, Light/Dark Toggle
- [ ] PWA-Konfiguration (Manifest, Service Worker, App-Icon)
- [ ] Deployment auf Netlify

---

*Erstellt mit Claude · Fruchtfolge Festival App · April 2026*
