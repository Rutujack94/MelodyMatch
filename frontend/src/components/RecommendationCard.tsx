import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal, Play } from 'lucide-react'
import type { RecommendationItem, SongSummary } from '../types'
import { AlbumArt } from './AlbumArt'
import { FavoriteButton } from './FavoriteButton'
import { MatchRing } from './MatchRing'
import { usePlayer } from '../hooks/usePlayerContext'

interface RecommendationCardProps {
  item: RecommendationItem
  queue?: SongSummary[]
}

export function RecommendationCard({ item, queue }: RecommendationCardProps) {
  const { playSong } = usePlayer()
  const [menuOpen, setMenuOpen] = useState(false)

  const handlePlayClick = () => {
    playSong(item, queue)
  }

  return (
    <div className="group relative glass rounded-xl p-4 transition-all hover:border-white/15 hover:-translate-y-0.5 animate-fade-up">
      <Link to={`/recommendations?track=${encodeURIComponent(item.track_name)}&id=${item.song_id}`}>
        <div className="relative mb-4">
          <AlbumArt seed={`${item.track_name}-${item.artist_name}`} size="md" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePlayClick()
            }}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gold text-ink-950 flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all"
            aria-label={`Play ${item.track_name}`}
          >
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </button>
        </div>
        <p className="text-sm font-semibold text-cream truncate">{item.track_name}</p>
        <p className="text-xs text-mist truncate mb-3">{item.artist_name}</p>
      </Link>

      <div className="flex items-center justify-between">
        <MatchRing value={item.similarity} size={38} />
        <div className="flex items-center">
          <FavoriteButton song={item} />
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex items-center justify-center rounded-full p-2 text-mist hover:bg-white/10 hover:text-cream transition-colors"
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 bottom-full mb-2 w-44 glass rounded-lg shadow-card py-1 z-10 text-sm"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link
                  to={`/recommendations?track=${encodeURIComponent(item.track_name)}&id=${item.song_id}`}
                  className="block px-3 py-2 hover:bg-white/5 text-cream"
                  onClick={() => setMenuOpen(false)}
                >
                  Find similar songs
                </Link>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-white/5 text-mist"
                  onClick={() => {
                    navigator.clipboard?.writeText(`${item.track_name} — ${item.artist_name}`)
                    setMenuOpen(false)
                  }}
                >
                  Copy title & artist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
