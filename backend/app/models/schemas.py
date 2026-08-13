"""Pydantic request/response models for the MelodyMatch API."""

from typing import Optional

from pydantic import BaseModel, Field


class SongSummary(BaseModel):
    """Lightweight song representation used in search results and lists."""

    song_id: int = Field(..., description="Internal dataset index, used to disambiguate songs.")
    track_name: str
    artist_name: str
    spotify_id: Optional[str] = Field(
        None, description="Spotify track ID, used to embed the official Spotify preview player."
    )


class SongDetail(SongSummary):
    """Full song representation including audio characteristics."""

    danceability: Optional[float] = None
    energy: Optional[float] = None
    tempo: Optional[float] = None
    valence: Optional[float] = None
    acousticness: Optional[float] = None
    instrumentalness: Optional[float] = None
    liveness: Optional[float] = None
    loudness: Optional[float] = None
    popularity: Optional[float] = None
    duration_ms: Optional[float] = None


class SearchResponse(BaseModel):
    query: str
    count: int
    results: list[SongSummary]


class RecommendationItem(SongSummary):
    similarity: float = Field(..., ge=0, le=1, description="1 - cosine distance, rounded to 4 decimals.")


class RecommendationResponse(BaseModel):
    query_song: SongSummary
    recommendations: list[RecommendationItem]


class HealthResponse(BaseModel):
    status: str


class RootResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str
