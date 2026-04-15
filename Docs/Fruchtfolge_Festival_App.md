# Fruchtfolge_Festival_App

# 🌾 Fruchtfolge Festival App

> **Projektbeschreibung:** Companion-App für das Fruchtfolge Festival. Die App begleitet Besucher vor Ort mit Lineup, Geländeplan und Live-Infos – offline-fähig als PWA.
> 
> 
> **Festival:** Ende August · **App-Launch-Ziel:** 2 Wochen vor Festival · **Plattform:** PWA (Progressive Web App)
> 

---

## 👥 Team & Kontakte

| Rolle | Name |
| --- | --- |
| App-Entwicklung | Jewels |
| Festival-Leitung | Fruchtfolgefestivalfestbüro |
| Ansprechpartner Inhalt | Hanno |
| Design (Figma) | Jewels |

---

## 🗺️ Roadmap

| Phase | Inhalt | Zeitraum | Status |
| --- | --- | --- | --- |
| Phase 1 | Planung & Setup | Woche 1–2 | 🟡 In Arbeit |
| Phase 2 | Design (Stitch → Figma) | Woche 3–5 | ⬜ Offen |
| Phase 3 | Entwicklung mit Claude | Woche 6–10 | ⬜ Offen |
| Phase 4 | Testing & Feedback | Woche 11–13 | ⬜ Offen |
| Phase 5 | Launch & Festival | Woche 14+ | ⬜ Offen |

**Status-Legende:** ✅ Fertig · 🟡 In Arbeit · ⬜ Offen · 🔴 Blockiert

---

## ✅ Aufgaben

### Phase 1 – Planung & Setup

- [x]  Feature-Liste Brainstorming (alleine)
- [x]  Features priorisieren: Must-have / Should-have / Nice-to-have
- [ ]  Notion-Workspace einrichten und Stakeholder einladen
- [ ]  Kick-off-Meeting mit den Organisatoren
- [ ]  Rollen klären: Wer liefert Inhalte? Wer gibt Feedback?
- [ ]  Abgrenzung App vs. Festival-Website besprechen
- [ ]  Ersten Review-Termin festlegen (Ziel: Woche 3–4)
- [ ]  Erste Skizzen in Stitch generieren
- [ ]  2–3 Stitch-Screenshots für Stakeholder aufbereiten und in Notion einfügen

[FFF_App_Design_System.md](FFF_App_Design_System.md)

### Phase 2 – Design

- [ ]  Figma-Account einrichten (kostenlos)
- [ ]  Stitch-Ergebnisse als Basis nach Figma übertragen
- [ ]  Farbpalette & Typografie festlegen (Festival-Vibe)
- [ ]  Screens designen: Lineup, Geländeplan, Infos, Navigation, Patrick
- [ ]  Klickbaren Prototyp in Figma erstellen
- [ ]  Erster Stakeholder-Review (Prototyp zeigen)
- [ ]  Feedback einarbeiten

### Phase 3 – Entwicklung

- [ ]  Projektstruktur mit Claude aufsetzen (PWA-Basis, React Multi-File)
- [ ]  Screen: Startseite / Home mit Countdown
- [ ]  Screen: Lineup / Timetable (eine Bühne)
- [ ]  Screen: Now Playing
- [ ]  Screen: Geländeplan (Bild-basiert)
- [ ]  Screen: Wichtige Infos (Notfall, Sanitär, Regeln)
- [ ]  Screen: Essen & Getränke
- [ ]  Screen: Ankündigungen
- [ ]  Screen: Wetter
- [ ]  Patrick v1 implementieren (regelbasierter Assistent mit Persönlichkeit)
- [ ]  Merch-Link und Spenden-Link einbauen
- [ ]  Offline-Funktion implementieren und testen
- [ ]  Inhalte der Organisatoren einpflegen
- [ ]  Zweiter Stakeholder-Review (funktionierender Build)

### Phase 4 – Testing

- [ ]  Beta-Link an Organisatoren schicken
- [ ]  Test auf verschiedenen Handys (iOS + Android)
- [ ]  Feedback sammeln und dokumentieren
- [ ]  Bugs fixen
- [ ]  Offline-Test auf dem echten Gelände (wenn möglich)

### Phase 5 – Launch

- [ ]  App auf Netlify deployen (kostenlos)
- [ ]  Domain / URL festlegen
- [ ]  QR-Code generieren
- [ ]  QR-Code an Organisatoren für Plakate / Tickets übergeben
- [ ]  App beim Festival vor Ort testen

---

## 🎯 Features

### Must-have – Version 1.0

| Feature | Beschreibung | Inhalt geliefert von |
| --- | --- | --- |
| Lineup / Timetable | Alle Bands mit Uhrzeit (eine Bühne) |  |
| Now Playing | Was gerade läuft – automatisch aus Timetable | — (technisch) |
| Geländeplan | Statisches Bild (PNG/PDF-Export aus CAD) | maZe, Wascht |
| Wichtige Infos | Öffnungszeiten, Notfallnummer, Regeln, Sanitär | Fruchtfolgefestivalfestbüro |
| Essen & Getränke | Übersicht der Stände | Team Essen |
| Ankündigungen | Kurzfristige Änderungen und Hinweise | Fruchtfolgefestivalfestbüro |
| Countdown | Countdown bis Festival-Start auf der Startseite | — (technisch) |
| Wetter | Aktuelle Wettervorhersage für das Festivalgelände | — (API) |
| Patrick v1 | Regelbasierter App-Assistent mit Charakter und Persönlichkeit | — (technisch) |
| Merch-Link | Link zur Vorbestellung auf der Festival-Website | Fruchtfolgefestivalfestbüro (URL) |
| Spenden-Link | Link zur Spendenseite des Vereins | Fruchtfolgefestivalfestbüro (URL) |
| Offline-Funktion | App funktioniert ohne Internet | — (technisch) |

### Should-have – Version 1.1

| Feature | Beschreibung | Aufwand |
| --- | --- | --- |
| Persönlicher Zeitplan | Bands als Favoriten markieren / merken | mittel |
| Push-Benachrichtigungen | Erinnerung vor Lieblingsauftritt + Ankündigungen | hoch |
| Band-Links | Verlinkung der Band-Homepages im Lineup | gering |
| Geländeplan interaktiv | Klickbare Bereiche auf dem Geländeplan | mittel |
| Feedback-Formular | Besucher-Rating und Kommentare nach dem Festival | mittel |
| Zweisprachigkeit | Deutsch + Englisch (abhängig von internationalem Publikum) | mittel |

### Nice-to-have – Version 2.0 / nächstes Jahr

| Feature | Beschreibung | Aufwand |
| --- | --- | --- |
| Patrick mit KI | Echter KI-Assistent mit freiem Chat, Situationswitz und echtem Patrick-Feeling | hoch |
| 3D-Geländeplan | Interaktiver 3D-Viewer auf Basis des Fusion-360-CAD-Modells | hoch |
| Community-Wall | Fotos oder Nachrichten teilen | hoch |

---

## 📋 Kick-off Meeting

**Datum:** [Datum eintragen]

**Teilnehmer:** [Namen]

### Fragen für das Meeting

- Wie viele Besucher werden erwartet?
- Gibt es WLAN oder mobiles Netz auf dem Gelände?
- Wie kommuniziert ihr heute Änderungen am Programm?
- Wer pflegt die Inhalte (Lineup, Zeiten) – und bis wann liegen sie vor?
- Wie ist die Abgrenzung zur Festival-Website geplant? (Vorschlag: Website informiert vorher, App begleitet vor Ort)
- Soll die App auf der Festival-Website verlinkt werden?
- Wer ist mein fester Ansprechpartner für App-Feedback?
- Wie international ist das Publikum? (Relevant für Zweisprachigkeit)
- Gibt es eine Vereins-Spendenseite / PayPal – welcher Link soll eingebaut werden?
- Merch: Läuft Vorbestellung über die Festival-Website – welcher Link?

### Antworten & Notizen

[Hier nach dem Meeting ausfüllen]

### Entscheidungen

[Hier festhalten, was beschlossen wurde]

---

## 📝 Meeting-Notizen

### [Datum] – Kick-off

**Teilnehmer:**

**Themen:**

**Beschlüsse:**

**Nächste Schritte:**

---

### [Datum] – Erster Stakeholder-Review

**Teilnehmer:**

**Gezeigt:**

**Feedback:**

**Nächste Schritte:**

---

## 📦 Inhalte & Assets

*Hier sammeln, sobald die Organisatoren etwas liefern.*

| Asset | Format | Status | Erhalten am |
| --- | --- | --- | --- |
| Lineup / Bandreihenfolge | Text / Excel | ⬜ Ausstehend | — |
| Auftrittzeiten | Text / Excel | ⬜ Ausstehend | — |
| Geländeplan (CAD-Export) | PNG oder PDF | ⬜ Ausstehend | — |
| Festival-Logo | PNG / SVG | ⬜ Ausstehend | — |
| Fotos der Bands | JPG | ⬜ Ausstehend | — |
| Notfallkontakte | Text | ⬜ Ausstehend | — |
| Essen & Getränke Standliste | Text | ⬜ Ausstehend | — |
| Merch-Link (URL) | URL | ⬜ Ausstehend | — |
| Spenden-Link (URL) | URL | ⬜ Ausstehend | — |

---

## 🔗 Links & Ressourcen

| Was | Link |
| --- | --- |
| Stitch (KI-Design-Tool) | https://labs.google/stitch |
| Figma (Design) | https://figma.com |
| Netlify (Hosting, kostenlos) | https://netlify.com |
| Notion (dieses Dokument) | — |
| App-URL (nach Launch) | [wird ergänzt] |
| QR-Code Generator | https://qr-code-generator.com |

---

## 💬 Offene Fragen

| Frage | Gestellt von | Status |
| --- | --- | --- |
| Gibt es WLAN auf dem Gelände? | [Name] | ⬜ Offen |
| Wer liefert den Geländeplan und in welchem Format? | [Name] | ⬜ Offen |
| Soll die App auf der Festival-Website verlinkt werden? | [Name] | ⬜ Offen |
| Wie international ist das Publikum? (Zweisprachigkeit) | [Name] | ⬜ Offen |
| Welcher Link für Spenden / Vereinskonto? | [Name] | ⬜ Offen |

---

*Zuletzt aktualisiert: April 2026 · Erstellt mit Claude*

| Rolle | Name |
| --- | --- |
| App-Entwicklung | Jewels |
| Festival-Leitung | Fruchtfolgefestivalfestbüro |
| Ansprechpartner Inhalt | Hanno |
| Design (Figma) | Jewels |

[FFF_App_Design_System](https://www.notion.so/FFF_App_Design_System-33e0382132de80308474e572076feb8f?pvs=21)