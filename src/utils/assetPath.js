const base = import.meta.env.BASE_URL

export function asset(path) {
  return `${base}${path.replace(/^\//, '')}`
}
