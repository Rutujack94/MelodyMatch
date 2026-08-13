import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import type { SongSummary } from '../types'
import { AlbumArt } from './AlbumArt'
import { FavoriteButton } from './FavoriteButton'
import { usePlayer } from '../hooks/usePlayerContext'

interface SongCardProps {
  song: SongSummary
  onSelect?: (song: SongSummary) => void
}

export function SongCard({ song, onSelect }: SongCardProps) {
  const { playSong } = usePlayer()

  return (
    <div className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
      <Link
        to={`/recommendations?track=${encodeURIComponent(song.track_name)}&id=${song.song_id}`}
        onClick={() => onSelect?.(song)}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <div className="relative shrink-0">
          <AlbumArt seed={`${song.track_name}-${song.artist_name}`} size="sm" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              playSong(song)
            }}
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-ink-950/0 group-hover:bg-ink-950/50 opacity-0 group-hover:opacity-100 transition-all"
            aria-label={`Play ${song.track_name}`}
          >
            <Play size={16} className="text-cream fill-cream" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-cream truncate">{song.track_name}</p>
          <p className="text-xs text-mist truncate">{song.artist_name}</p>
        </div>
      </Link>
      <FavoriteButton song={song} size={16} />
    </div>
  )
}
