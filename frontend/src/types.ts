export interface SongSummary {
  song_id: number
  track_name: string
  artist_name: string
  spotify_id?: string | null
}

export interface SongDetail extends SongSummary {
  danceability?: number | null
  energy?: number | null
  tempo?: number | null
  valence?: number | null
  acousticness?: number | null
  instrumentalness?: number | null
  liveness?: number | null
  loudness?: number | null
  popularity?: number | null
  duration_ms?: number | null
}

export interface RecommendationItem extends SongSummary {
  similarity: number
}

export interface SearchResponse {
  query: string
  count: number
  results: SongSummary[]
}

export interface RecommendationResponse {
  query_song: SongSummary
  recommendations: RecommendationItem[]
}
