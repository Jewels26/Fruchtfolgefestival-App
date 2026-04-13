import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import AppShell from './components/layout/AppShell'
import './styles/global.css'

// Screens — werden Schritt für Schritt ergänzt
import HomeScreen    from './screens/HomeScreen'
import LineupScreen  from './screens/LineupScreen'
import MapScreen     from './screens/MapScreen'
import FoodScreen    from './screens/FoodScreen'
import InfoScreen    from './screens/InfoScreen'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index        element={<HomeScreen />} />
            <Route path="lineup" element={<LineupScreen />} />
            <Route path="map"    element={<MapScreen />} />
            <Route path="food"   element={<FoodScreen />} />
            <Route path="info"   element={<InfoScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
