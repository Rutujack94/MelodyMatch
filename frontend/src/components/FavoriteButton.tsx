import { Heart } from 'lucide-react'
import type { SongSummary } from '../types'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  song: SongSummary
  size?: number
  className?: string
}

export function FavoriteButton({ song, size = 18, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(song.song_id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        toggleFavorite(song)
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${song.track_name} from favorites` : `Add ${song.track_name} to favorites`}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-all hover:bg-white/10 active:scale-90 ${className}`}
    >
      <Heart
        size={size}
        className={active ? 'fill-coral text-coral' : 'text-mist'}
        strokeWidth={2}
      />
    </button>
  )
}
