// ─── PERSISTED SET — "schon gesehen"-Marker, die App-Neustarts überleben ───
// Für Erinnerungen/Ankündigungen, die pro Gerät nur einmal auftauchen sollen.
// localStorage kann fehlschlagen (privates Fenster, Speicher voll) — dann
// kommt die Meldung im schlimmsten Fall nochmal, die App bricht aber nicht ab.

const PREFIX = 'fff2026:seen:'

export function loadSeenSet(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function saveSeenSet(key, set) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify([...set]))
  } catch {
    // ignorieren — s.o.
  }
}
