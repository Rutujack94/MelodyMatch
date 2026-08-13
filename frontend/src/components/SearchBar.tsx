import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Search, X } from 'lucide-react'
import type { SongSummary } from '../types'
import { searchSongs } from '../services/api'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { AlbumArt } from './AlbumArt'

interface SearchBarProps {
  onSelect?: (song: SongSummary) => void
  size?: 'lg' | 'md'
  autoFocus?: boolean
  placeholder?: string
}

export function SearchBar({ onSelect, size = 'md', autoFocus, placeholder = 'Search for a song…' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SongSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [errored, setErrored] = useState(false)
  const debounced = useDebouncedValue(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const term = debounced.trim()
    if (!term) {
      setResults([])
      setLoading(false)
      setErrored(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setErrored(false)
    searchSongs(term, 8)
      .then((res) => {
        if (!cancelled) setResults(res.results)
      })
     .catch((error) => {
  console.error('SEARCH ERROR:', error)
  if (!cancelled) setErrored(true)
})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debounced])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (song: SongSummary) => {
    setOpen(false)
    setQuery('')
    onSelect?.(song)
    navigate(`/recommendations?track=${encodeURIComponent(song.track_name)}&id=${song.song_id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleSelect(results[0])
    } else if (query.trim()) {
      navigate(`/recommendations?track=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  const heightClass = size === 'lg' ? 'h-14 text-base' : 'h-11 text-sm'

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={size === 'lg' ? 20 : 16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-mist pointer-events-none"
        />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`w-full ${heightClass} glass rounded-full pl-11 pr-11 text-cream placeholder:text-mist focus:border-gold/40 transition-colors`}
          aria-label="Search for a song"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-cream"
            aria-label="Clear search"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
          </button>
        )}
      </form>

      {open && query.trim() && (
        <div className="absolute z-20 mt-2 w-full glass rounded-2xl shadow-card overflow-hidden max-h-96 overflow-y-auto">
          {loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-mist">Searching…</p>
          )}
          {!loading && errored && (
            <p className="px-4 py-3 text-sm text-coral">Search is unavailable right now. Please try again.</p>
          )}
          {!loading && !errored && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-mist">No songs found. Try another title.</p>
          )}
          {results.map((song) => (
            <button
              key={song.song_id}
              type="button"
              onClick={() => handleSelect(song)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <AlbumArt seed={`${song.track_name}-${song.artist_name}`} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream truncate">{song.track_name}</p>
                <p className="text-xs text-mist truncate">{song.artist_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
