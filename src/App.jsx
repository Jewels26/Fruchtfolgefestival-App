import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { PatrickProvider } from './context/PatrickContext'
import AppShell from './components/layout/AppShell'
import './styles/global.css'

// Screens — werden Schritt für Schritt ergänzt
import HomeScreen    from './screens/HomeScreen'
import LineupScreen  from './screens/LineupScreen'
import MapScreen     from './screens/MapScreen'
import FoodScreen    from './screens/FoodScreen'
import InfoScreen    from './screens/InfoScreen'
import GluecksPfeffiScreen from './screens/GluecksPfeffiScreen'

export default function App() {
  return (
    <ThemeProvider>
      <PatrickProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index        element={<HomeScreen />} />
              <Route path="lineup" element={<LineupScreen />} />
              <Route path="map"    element={<MapScreen />} />
              <Route path="food"   element={<FoodScreen />} />
              <Route path="info"   element={<InfoScreen />} />
              <Route path="pfeffi" element={<GluecksPfeffiScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PatrickProvider>
    </ThemeProvider>
  )
}
