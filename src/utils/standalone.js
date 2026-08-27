// ─── STANDALONE-ERKENNUNG — läuft die App installiert (Homescreen-Icon) statt im Browser-Tab? ───
// display-mode: standalone deckt Chrome/Edge/Android ab, navigator.standalone
// ist Apples proprietäre Property fürs iOS-Pendant (Safari feuert kein
// 'appinstalled' und die display-mode-Query ist auf iOS nicht durchgängig
// zuverlässig) — deshalb beide Checks kombiniert.
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}
