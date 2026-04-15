# 🚀 GitHub Pages Deployment — Fruchtfolge Festival App

## Einmaliges Setup (bereits erledigt)

### 1. Tools installiert
- Git installiert via [git-scm.com](https://git-scm.com/download/win)
- Git konfiguriert:
  ```
  git config --global user.name "Jewels26"
  git config --global user.email "julia.beutmueller@googlemail.com"
  ```

### 2. Projekt konfiguriert

**`vite.config.js`** — base Pfad gesetzt:
```js
export default defineConfig({
  base: '/Fruchtfolgefestival-App/',
  plugins: [react()],
})
```

**`App.jsx`** — Router basename gesetzt:
```jsx
<BrowserRouter basename="/Fruchtfolgefestival-App">
```

**`package.json`** — deploy Script + homepage ergänzt:
```json
"homepage": "https://Jewels26.github.io/Fruchtfolgefestival-App",
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

**`src/utils/assetPath.js`** — Helper für Bildpfade:
```js
const base = import.meta.env.BASE_URL

export function asset(path) {
  return `${base}${path.replace(/^\//, '')}`
}
```
→ Alle Bilder im Code werden über `asset('dateiname.png')` statt `/dateiname.png` eingebunden.

### 3. Repo verbunden
```
git init
git remote add origin https://github.com/Jewels26/Fruchtfolgefestival-App.git
git branch -M main
```

### 4. GitHub Pages aktiviert
- Repo auf **Public** gestellt
- Settings → Pages → Branch: **gh-pages** / Folder: **/ (root)**

---

## 🔄 Neues Update deployen

Jedes Mal wenn du Änderungen hochladen willst:

```
npm run build
npm run deploy
```

Das war's! `gh-pages` buildet und pusht automatisch.

Wenn du auch den Source-Code auf GitHub aktualisieren willst (empfohlen):
```
git add .
git commit -m "Kurze Beschreibung der Änderung"
git push origin main
```

---

## 🖼️ Neue Bilder hinzufügen

Alle Bilder liegen im Ordner `public/` — GitHub Pages serviert sie von dort.

### Bandfotos
1. Foto in `public/bands/` ablegen (z.B. `public/bands/BandName.jpg`)
2. In `src/data/lineup.js` den `photo` Eintrag der Band aktualisieren:
   ```js
   photo: '/bands/BandName.jpg',
   ```
3. **Wichtig:** Im Code wird das Bild dann automatisch über die `asset()` Funktion korrekt eingebunden — du musst in `LineupScreen.jsx` nichts ändern.

### Andere Bilder (Logo, Icons etc.)
1. Datei direkt in `public/` ablegen
2. Im Code einbinden mit:
   ```jsx
   import { asset } from '../utils/assetPath'
   // ...
   <img src={asset('dateiname.png')} />
   ```

### ⚠️ Wichtig
Bilder **niemals** mit `/dateiname.png` einbinden — das funktioniert nur lokal, nicht auf GitHub Pages. Immer `asset()` verwenden!

---

## 🌐 Live URL

**https://Jewels26.github.io/Fruchtfolgefestival-App/**

---

## 📦 Nächster Schritt: Richtiges Deployment

Für den finalen Launch beim Festival:
- Organisatoren legen eigenen **Netlify** Account an
- Repo wird mit Netlify verbunden → automatisches Deployment bei jedem Push
- Eigene Domain möglich (z.B. `app.fruchtfolgefestival.de`)
