import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { MusicPlayer } from './components/MusicPlayer'
import { PlayerProvider, usePlayer } from './hooks/usePlayerContext'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { Recommendations } from './pages/Recommendations'
import { Favorites } from './pages/Favorites'
import { About } from './pages/About'
import { NotFound } from './pages/NotFound'

function AppShell() {
  const { current } = usePlayer()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${current ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <AppShell />
    </PlayerProvider>
  )
}
