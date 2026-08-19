import { createContext } from 'react'

// Eigene Datei nur für das rohe Context-Objekt, damit weder PatrickContext.jsx
// (Provider-Komponente) noch usePatrick.js (Hook) mehr als eine Sache
// exportieren — sonst greift React Fast Refresh nicht und jede Änderung löst
// einen vollen Reload statt HMR aus.
export const PatrickContext = createContext()
