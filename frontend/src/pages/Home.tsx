import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import type { SongSummary } from '../types'
import { searchSongs } from '../services/api'
import { HeroSection } from '../components/HeroSection'
import { RecentSongs } from '../components/RecentSongs'
import { SongCard } from '../components/SongCard'
import { RowSkeleton } from '../components/LoadingSkeleton'
import { useRecentSearches } from '../hooks/useRecentSearches'

const POPULAR_SEEDS = ['Blinding Lights', 'Levitating', 'Bad Guy', 'Someone Like You']

export function Home() {
  const { addRecent } = useRecentSearches()
  const [popular, setPopular] = useState<SongSummary[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all(POPULAR_SEEDS.map((q) => searchSongs(q, 1).catch(() => ({ results: [] }))))
      .then((responses) => {
        if (cancelled) return
        const songs = responses.flatMap((r) => r.results).filter(Boolean)
        setPopular(songs)
      })
      .finally(() => {
        if (!cancelled) setLoadingPopular(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <HeroSection onSelect={addRecent} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 space-y-16">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-gold" />
            <h2 className="text-xl font-semibold text-cream">Popular Searches</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 glass rounded-2xl p-2">
            {loadingPopular
              ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
              : popular.map((song) => <SongCard key={song.song_id} song={song} onSelect={addRecent} />)}
          </div>
        </section>

        <RecentSongs />

        <section className="glass rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-cream mb-2">Not sure where to start?</h2>
          <p className="text-mist mb-6 max-w-md mx-auto">
            Browse curated picks and explore songs by the artists you already love on the Discover page.
          </p>
          <Link to="/discover" className="btn-primary">
            Explore Discover
          </Link>
        </section>
      </div>
    </div>
  )
}
