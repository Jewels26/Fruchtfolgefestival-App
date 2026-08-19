import { createContext } from 'react'

// Eigene Datei nur für das rohe Context-Objekt, damit weder ThemeContext.jsx
// (Provider-Komponente) noch useTheme.js (Hook) mehr als eine Sache
// exportieren — sonst greift React Fast Refresh nicht und jede Änderung löst
// einen vollen Reload statt HMR aus.
export const ThemeContext = createContext()
