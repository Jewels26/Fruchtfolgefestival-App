// ─── Play-Button-Sprüche ───
// Patricks Antwort, wenn wer in der NowPlayingBar auf "abspielen" tippt —
// eigene Datei, damit Patrick.jsx nur die Komponente exportiert (React Fast
// Refresh braucht das, sonst löst jede Änderung einen vollen Reload statt HMR aus).
const PLAY_BUTTON_MESSAGES = (name) => [
  `Haha, ich spiel da nix ab. 🎸 ${name} spielt LIVE auf der Bühne — da musst du schon hingehen!`,
  `Des is koa Spotify. ${name} macht das gerade live für dich — ab zur Bühne!`,
  `Streaming gibt's dahoam. Hier spielen echte Menschen! ${name} ist gerade drüben. 🤘`,
  `I bin a Festival-App, kein Musikplayer! Geh hin, ${name} wartet ned ewig.`,
]

export function getRandomPlayMessage(bandName) {
  const list = PLAY_BUTTON_MESSAGES(bandName)
  return list[Math.floor(Math.random() * list.length)]
}
