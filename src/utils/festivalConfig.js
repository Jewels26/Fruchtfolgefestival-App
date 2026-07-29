// ─── FESTIVAL-ZEITRAUM — zentrale Quelle ───
// Wird von HomeScreen (Countdown) und GluecksPfeffiScreen (Festival-Fenster
// für Glücks-Pfeffi) gemeinsam genutzt. Muss zu festival_start/festival_end
// im Pfeffi-Sheet passen (siehe apps-script/pfeffi.gs).
export const FESTIVAL_CONFIG = {
  year: 2026,
  est: 2025,
  gatesOpen:   new Date(2026, 7, 28, 16, 0, 0),
  festivalEnd: new Date(2026, 7, 30, 11, 0, 0),
}
