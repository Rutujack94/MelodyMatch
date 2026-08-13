import { Trash2 } from 'lucide-react'
import { useRecentSearches } from '../hooks/useRecentSearches'
import { SongCard } from './SongCard'
import { EmptyState } from './EmptyState'

export function RecentSongs() {
  const { recent, clearRecent } = useRecentSearches()

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-cream">Recently Discovered</h2>
        {recent.length > 0 && (
          <button
            type="button"
            onClick={clearRecent}
            className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-coral transition-colors"
          >
            <Trash2 size={13} />
            Clear history
          </button>
        )}
      </div>
      {recent.length === 0 ? (
        <EmptyState
          title="No searches yet"
          description="Songs you look up will show up here so you can jump back into them."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 glass rounded-2xl p-2">
          {recent.map((song) => (
            <SongCard key={song.song_id} song={song} />
          ))}
        </div>
      )}
    </section>
  )
}
