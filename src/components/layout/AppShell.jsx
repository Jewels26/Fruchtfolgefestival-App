import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import NowPlayingBar from './NowPlayingBar'
import Patrick from '../ui/Patrick'

export default function AppShell() {
  return (
    <div className="app-bg">
  <div className="bg-texture" aria-hidden="true" />
      <Header />
      <main>
        <Outlet />
      </main>
      <NowPlayingBar />
      <BottomNav />
      <Patrick />
    </div>
  )
}
