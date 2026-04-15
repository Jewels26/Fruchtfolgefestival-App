# Patrick — Konzept & Entscheidungen
> Fruchtfolge Festival App · Stand: April 2026 · Jewels + Claude

---

## Was ist Patrick?

Patrick ist der Festival-Assistent der FFF-App. Er ist kein generischer Chatbot — er ist eine Figur mit Persönlichkeit, die das Festival kennt und begleitet.

**Charakter:** Etwas schüchterner aber herzlicher Niederbayer. Kennt jeden Act, jeden Winkel des Bauernhofs, die Geschichte des Festivals. Redet authentisch, nicht übertrieben. Hilfsbereit aber nicht aufdringlich.

---

## Version 1 — Regelbasiert (dieses Jahr)

### Was Patrick kann

- **Proaktive Alerts:** Poppt automatisch auf 15 Minuten, 5 Minuten und zum Start jedes Acts auf — zieht sich die Daten aus `lineup.js`
- **Keyword-Erkennung:** Antwortet auf häufige Fragen (Toilette, Notfall, Lineup, Wetter, Öffnungszeiten …)
- **Random-Sprüche:** Poppt zu bestimmten Zeiten ungefragt auf mit situativen Kommentaren (Mitternacht, Morgen, Festivalende …)
- **Großes Antwortrepertoire:** 80–100 sorgfältig geschriebene Antworten in Patricks Stimme — fühlt sich persönlich an auch ohne echte KI

### Was Patrick noch nicht kann

- Echten freien Chat führen
- Echtzeit-Infos selbst mitbekommen (Verspätungen, spontane Aktionen)
- Auf unbekannte Fragen sinnvoll reagieren

### ✅ Bug gefixt (April 2026)

Beim Übergang zwischen Triggern (z.B. 5-Minuten → Start) wurden frühere Trigger nicht automatisch dismissed, wodurch der neue Trigger nie gefeuert hat. Gelöst durch automatisches Dismissen früherer Trigger derselben Band sobald ein neuerer feuert. Getestet und funktioniert.

### Nächster Schritt für v1

Jewels erzählt Claude in einer Session alles über das Festival — Geschichte, Gelände, Insider, Patricks Eigenheiten. Claude schreibt daraus das komplette Antwort-Repertoire (80–100 Einträge). Aufwand für Jewels: ~30 Minuten erzählen.

---

## Version 2 — Claude API (nächstes Jahr)

### Entscheidung

Für 2026 bewusst zurückgestellt. Gründe:
- Festival ist Low-Budget, jeder Posten wird überlegt
- Risiko: betrunkene Besucher die Patrick über 2 Festivaltage zutexten → unkontrollierbare Kosten
- Regelbasierte Version mit gutem Repertoire erfüllt den Zweck für Jahr 1

### Wie es funktionieren würde

Google Sheets als Content-Backend (Ankündigungen, Verspätungen, Events) → App pollt periodisch → aktueller Stand landet als Kontext im System-Prompt → Claude API (Haiku) generiert Antwort in Patricks Stimme.

Technisch: Netlify Function als Proxy (versteckt den API-Key), Google Sheets API (kostenlos), Anthropic API.

### Kosten (zur Orientierung für 2027)

Claude Haiku kostet ca. $0.001 pro Konversation. Bei 200 Besuchern × 10 Nachrichten ≈ **$2 fürs gesamte Festival**. Worst Case mit sehr aktiver Nutzung: unter $20.

Sicherheitsnetz: hartes Tageslimit (z.B. 500 API-Calls/Tag) in der Netlify Function, danach Fallback auf regelbasiert mit einer netten Nachricht.

### System-Prompt Idee

```
Du bist Patrick, ein schüchterner aber herzlicher Niederbayer, der das 
Fruchtfolge Festival in- und auswendig kennt. Du kennst jeden Act, jeden 
Winkel des Bauernhofs, die Geschichte des Festivals. Du redest wie jemand 
der halt vom Dorf ist — nicht übertrieben, aber authentisch. Du bist 
hilfsbereit aber nicht aufdringlich.
```

---

## Technische Referenz

**Dateien:**
- `src/components/ui/Patrick.jsx` — Komponente + `usePatrickAlerts` Hook
- `src/components/ui/Patrick.css` — Styling
- `src/data/lineup.js` — Datenquelle für Trigger-Zeitpunkte

**Trigger-Logik:** Intervall (30 Sek.) prüft alle Bands gegen aktuelle Uhrzeit. Fenster: ±0.5 Minuten um den Trigger-Zeitpunkt. Einmal dismissed → kommt nicht wieder (bis Seite neu geladen wird).

**Testen:** `new Date()` im Hook durch Fake-Zeit ersetzen, Intervall auf 5000ms stellen.

---

*Erstellt mit Claude · Fruchtfolge Festival App · April 2026*
