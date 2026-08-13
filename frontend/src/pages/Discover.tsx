import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Dices, Mic2, TrendingUp } from 'lucide-react'
import type { SongSummary } from '../types'
import { searchSongs } from '../services/api'
import { SongCard } from '../components/SongCard'
import { RowSkeleton } from '../components/LoadingSkeleton'
import { RecentSongs } from '../components/RecentSongs'
import { useRecentSearches } from '../hooks/useRecentSearches'

const POPULAR_SEEDS = ['Blinding Lights', 'Levitating', 'Bad Guy', 'Someone Like You', 'Perfect', 'Shape of You']
const ARTIST_SEEDS = ['Ed Sheeran', 'Taylor Swift', 'Drake', 'Adele']
const DISCOVERY_WORDS = ['midnight', 'sunshine', 'heart', 'dream', 'fire', 'rain', 'gold', 'run', 'love', 'stars']

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function Discover() {
  const navigate = useNavigate()
  const { addRecent } = useRecentSearches()
  const [popular, setPopular] = useState<SongSummary[]>([])
  const [byArtist, setByArtist] = useState<SongSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [rolling, setRolling] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      Promise.all(POPULAR_SEEDS.map((q) => searchSongs(q, 1).catch(() => ({ results: [] })))),
      Promise.all(ARTIST_SEEDS.map((q) => searchSongs(q, 2).catch(() => ({ results: [] })))),
    ])
      .then(([popularRes, artistRes]) => {
        if (cancelled) return
        setPopular(popularRes.flatMap((r) => r.results))
        setByArtist(artistRes.flatMap((r) => r.results))
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleSurpriseMe = async () => {
    setRolling(true)
    try {
      const word = pickRandom(DISCOVERY_WORDS)
      const res = await searchSongs(word, 15)
      if (res.results.length > 0) {
        const song = pickRandom(res.results)
        addRecent(song)
        navigate(`/recommendations?track=${encodeURIComponent(song.track_name)}&id=${song.song_id}`)
        return
      }
    } catch {
      // fall through to no-op; button just stops spinning
    }
    setRolling(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-28 space-y-16">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 glass rounded-2xl p-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Compass size={18} className="text-teal" />
            <span className="text-xs uppercase tracking-wide text-mist">Discover</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-cream mb-1">Somewhere new to listen</h1>
          <p className="text-mist text-sm max-w-md">
            Explore what&apos;s trending, browse songs from artists you know, or let us surprise you.
          </p>
        </div>
        <button type="button" onClick={handleSurpriseMe} disabled={rolling} className="btn-primary shrink-0">
          <Dices size={18} className={rolling ? 'animate-spin' : ''} />
          {rolling ? 'Rolling the dice…' : 'Surprise Me'}
        </button>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-gold" />
          <h2 className="text-xl font-semibold text-cream">Trending Right Now</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 glass rounded-2xl p-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
            : popular.map((song) => <SongCard key={song.song_id} song={song} onSelect={addRecent} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Mic2 size={18} className="text-coral" />
          <h2 className="text-xl font-semibold text-cream">From Artists You Know</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 glass rounded-2xl p-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
            : byArtist.map((song) => <SongCard key={song.song_id} song={song} onSelect={addRecent} />)}
        </div>
      </section>

      <RecentSongs />
    </div>
  )
}
