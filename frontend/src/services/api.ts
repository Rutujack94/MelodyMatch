import axios from 'axios'
import type { RecommendationResponse, SearchResponse, SongDetail } from '../types'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  timeout: 10000,
})

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const detail = (err.response.data as { detail?: string })?.detail
      return new ApiError(detail || 'Something went wrong. Please try again.', err.response.status)
    }
    if (err.request) {
      return new ApiError('Recommendation service is currently unavailable. Please try again.')
    }
  }
  return new ApiError('Something went wrong. Please try again.')
}

export async function searchSongs(query: string, limit = 10): Promise<SearchResponse> {
  try {
    const { data } = await api.get<SearchResponse>('/search', { params: { q: query, limit } })
    return data
  } catch (err) {
    throw toApiError(err)
  }
}

export async function getRecommendations(
  trackName: string,
  n = 8,
  songId?: number
): Promise<RecommendationResponse> {
  try {
    const { data } = await api.get<RecommendationResponse>('/recommend', {
      params: { track_name: trackName, n, song_id: songId },
    })
    return data
  } catch (err) {
    throw toApiError(err)
  }
}

export async function getSong(songId: number): Promise<SongDetail> {
  try {
    const { data } = await api.get<SongDetail>(`/song/${songId}`)
    return data
  } catch (err) {
    throw toApiError(err)
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    await api.get('/health')
    return true
  } catch {
    return false
  }
}
