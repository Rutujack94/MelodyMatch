import { useCallback, useState } from 'react'
import type { SongSummary } from '../types'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'melodymatch:recent-searches'
const MAX_ITEMS = 10

export function useRecentSearches() {
  const [recent, setRecent] = useState<SongSummary[]>(() => readJSON<SongSummary[]>(KEY, []))

  const addRecent = useCallback((song: SongSummary) => {
    setRecent((prev) => {
      const deduped = prev.filter((s) => s.song_id !== song.song_id)
      const next = [song, ...deduped].slice(0, MAX_ITEMS)
      writeJSON(KEY, next)
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    writeJSON(KEY, [])
    setRecent([])
  }, [])

  return { recent, addRecent, clearRecent }
}
