import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, Sparkles } from 'lucide-react'
import type { RecommendationResponse } from '../types'
import { ApiError, getRecommendations } from '../services/api'
import { SearchBar } from '../components/SearchBar'
import { AlbumArt } from '../components/AlbumArt'
import { FavoriteButton } from '../components/FavoriteButton'
import { RecommendationGrid } from '../components/RecommendationGrid'
import { CardSkeletonGrid } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { useRecentSearches } from '../hooks/useRecentSearches'
import { usePlayer } from '../hooks/usePlayerContext'

export function Recommendations() {
  const [params] = useSearchParams()
  const track = params.get('track') || ''
  const idParam = params.get('id')
  const songId = idParam ? Number(idParam) : undefined

  const [data, setData] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addRecent } = useRecentSearches()
  const { playSong } = usePlayer()

  const fetchRecs = () => {
    if (!track) {
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    getRecommendations(track, 8, songId)
      .then((res) => {
        setData(res)
        addRecent(res.query_song)
      })
      .catch((err: unknown) => {
        const msg = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
        setError(msg)
        setData(null)
      })
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchRecs, [track, songId])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-28">
      <div className="mb-10 max-w-xl">
        <SearchBar placeholder="Search for another song…" onSelect={addRecent} />
      </div>

      {!track && (
        <EmptyState
          icon={Sparkles}
          title="Search for a song to get started"
          description="Pick any track and MelodyMatch will find songs with a similar sound and style."
        />
      )}

      {track && loading && (
        <div className="space-y-8">
          <div className="h-24 glass rounded-2xl animate-pulse" />
          <p className="text-sm text-mist">Finding songs you&apos;ll love…</p>
          <CardSkeletonGrid />
        </div>
      )}

      {track && !loading && error && <ErrorMessage message={error} onRetry={fetchRecs} />}

      {track && !loading && !error && data && (
        <div className="space-y-10 animate-fade-up">
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <AlbumArt seed={`${data.query_song.track_name}-${data.query_song.artist_name}`} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wide text-mist mb-1">Selected Song</p>
              <h1 className="text-lg font-semibold text-cream truncate">🎵 {data.query_song.track_name}</h1>
              <p className="text-sm text-mist truncate">{data.query_song.artist_name}</p>
            </div>
            <button
              type="button"
              onClick={() => playSong(data.query_song)}
              className="btn-secondary hidden sm:inline-flex"
            >
              <Play size={15} />
              Play
            </button>
            <FavoriteButton song={data.query_song} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-cream mb-4">Recommended For You</h2>
            {data.recommendations.length === 0 ? (
              <EmptyState
                title="No close matches found"
                description="We couldn't find similar songs for this track yet. Try another one."
              />
            ) : (
              <RecommendationGrid items={data.recommendations} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
