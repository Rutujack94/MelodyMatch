import { useCallback, useEffect, useState } from 'react'
import type { SongSummary } from '../types'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'melodymatch:favorites'
const EVENT = 'melodymatch:favorites-changed'

function load(): SongSummary[] {
  return readJSON<SongSummary[]>(KEY, [])
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<SongSummary[]>(() => load())

  useEffect(() => {
    const onChange = () => setFavorites(load())
    window.addEventListener(EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const persist = useCallback((next: SongSummary[]) => {
    writeJSON(KEY, next)
    setFavorites(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const isFavorite = useCallback(
    (songId: number) => favorites.some((f) => f.song_id === songId),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (song: SongSummary) => {
      const exists = favorites.some((f) => f.song_id === song.song_id)
      const next = exists
        ? favorites.filter((f) => f.song_id !== song.song_id)
        : [song, ...favorites]
      persist(next)
    },
    [favorites, persist]
  )

  const removeFavorite = useCallback(
    (songId: number) => persist(favorites.filter((f) => f.song_id !== songId)),
    [favorites, persist]
  )

  return { favorites, isFavorite, toggleFavorite, removeFavorite }
}
