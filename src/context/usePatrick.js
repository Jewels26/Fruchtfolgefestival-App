import { useContext } from 'react'
import { PatrickContext } from './patrickContextCore'

// Eigene Datei, damit PatrickContext.jsx nur die Provider-Komponente exportiert
// (React Fast Refresh braucht das, sonst löst jede Änderung einen vollen Reload
// statt HMR aus).
export const usePatrick = () => useContext(PatrickContext)
