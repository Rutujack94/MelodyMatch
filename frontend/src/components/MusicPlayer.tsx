import { SkipBack, SkipForward, X } from 'lucide-react'
import { usePlayer } from '../hooks/usePlayerContext'
import { FavoriteButton } from './FavoriteButton'

export function MusicPlayer() {
  const { current, queue, next, previous, close } = usePlayer()

  if (!current) return null

  const hasQueue = queue.length > 1

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-ink-950/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-4">
        {hasQueue && (
          <button
            type="button"
            onClick={previous}
            className="hidden sm:inline-flex text-mist hover:text-cream transition-colors shrink-0"
            aria-label="Previous song"
          >
            <SkipBack size={18} />
          </button>
        )}

        {current.spotify_id ? (
          <iframe
            key={current.spotify_id}
            title={`Spotify player — ${current.track_name}`}
            style={{ borderRadius: 12 }}
            src={`https://open.spotify.com/embed/track/${current.spotify_id}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="flex-1 min-w-0"
          />
        ) : (
          <div className="flex-1 min-w-0 flex items-center gap-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cream truncate">{current.track_name}</p>
              <p className="text-xs text-mist truncate">{current.artist_name}</p>
            </div>
            <p className="text-xs text-mist ml-auto">No preview available for this track.</p>
          </div>
        )}

        {hasQueue && (
          <button
            type="button"
            onClick={next}
            className="hidden sm:inline-flex text-mist hover:text-cream transition-colors shrink-0"
            aria-label="Next song"
          >
            <SkipForward size={18} />
          </button>
        )}

        <FavoriteButton song={current} size={17} className="shrink-0" />

        <button
          type="button"
          onClick={close}
          className="text-mist hover:text-cream transition-colors shrink-0"
          aria-label="Close player"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
