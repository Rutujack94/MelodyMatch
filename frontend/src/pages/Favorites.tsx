import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { SongCard } from '../components/SongCard'
import { EmptyState } from '../components/EmptyState'

export function Favorites() {
  const { favorites } = useFavorites()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-28">
      <div className="flex items-center gap-2 mb-2">
        <Heart size={18} className="text-coral" />
        <span className="text-xs uppercase tracking-wide text-mist">Your Library</span>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl text-cream mb-8">Favorites</h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on any song to save it here — it'll stick around even after you refresh."
          action={
            <Link to="/discover" className="btn-primary">
              Discover songs
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 glass rounded-2xl p-2">
          {favorites.map((song) => (
            <SongCard key={song.song_id} song={song} />
          ))}
        </div>
      )}
    </div>
  )
}
