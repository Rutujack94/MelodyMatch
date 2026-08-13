import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SongSummary } from '../types'

interface PlayerContextValue {
  queue: SongSummary[]
  currentIndex: number
  current: SongSummary | null
  playSong: (song: SongSummary, queue?: SongSummary[]) => void
  next: () => void
  previous: () => void
  close: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<SongSummary[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  const playSong = useCallback((song: SongSummary, newQueue?: SongSummary[]) => {
    const nextQueue = newQueue && newQueue.length > 0 ? newQueue : [song]
    const idx = nextQueue.findIndex((s) => s.song_id === song.song_id)
    setQueue(nextQueue)
    setCurrentIndex(idx >= 0 ? idx : 0)
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((idx) => {
      if (queue.length === 0 || idx < 0) return idx
      return (idx + 1) % queue.length
    })
  }, [queue.length])

  const previous = useCallback(() => {
    setCurrentIndex((idx) => {
      if (queue.length === 0 || idx < 0) return idx
      return (idx - 1 + queue.length) % queue.length
    })
  }, [queue.length])

  const close = useCallback(() => {
    setCurrentIndex(-1)
    setQueue([])
  }, [])

  const current = currentIndex >= 0 ? queue[currentIndex] ?? null : null

  const value = useMemo<PlayerContextValue>(
    () => ({ queue, currentIndex, current, playSong, next, previous, close }),
    [queue, currentIndex, current, playSong, next, previous, close]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider')
  return ctx
}
