// ─── Minimal-Markdown-Renderer für ABC-Texte: **fett** und [Text](url) ───
export function renderRichText(text) {
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  const parts = []
  let lastIndex = 0
  let key = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{match[1]}</strong>)
    } else {
      parts.push(
        <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer">{match[2]}</a>
      )
    }
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}
