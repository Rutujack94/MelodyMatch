"""Core business logic for search and recommendations.

Design note: we deliberately never build the full 130663 x 130663 cosine
similarity matrix. Instead we reuse the NearestNeighbors index that was
already fit (with brute-force cosine metric) on the TF-IDF matrix of each
song's tags. For a single query we only ever pull one row out of that
pre-fit sparse matrix and ask the index for its nearest neighbors, which is
fast and uses a trivial amount of memory.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

import pandas as pd

from app.utils.model_loader import ModelBundle, get_bundle


class SongNotFoundError(Exception):
    pass


@dataclass
class QuerySong:
    song_id: int
    track_name: str
    artist_name: str


def _row_to_summary(row: pd.Series) -> dict:
    raw_id = row.get("track_id")
    spotify_id = str(raw_id) if isinstance(raw_id, str) and raw_id else None
    return {
        "song_id": int(row["song_id"]),
        "track_name": str(row["track_name"]),
        "artist_name": str(row["artist_name"]),
        "spotify_id": spotify_id,
    }


def search_songs(query: str, limit: int = 10) -> list[dict]:
    """Case-insensitive, partial match search across track and artist name."""
    bundle: ModelBundle = get_bundle()
    songs = bundle.songs

    q = (query or "").strip().lower()
    if not q:
        return []

    mask = songs["_search_key"].str.contains(q, regex=False, na=False)
    matches = songs.loc[mask]

    # Rank exact/starts-with matches on track_name above generic substring hits.
    track_lower = matches["track_name"].str.lower()
    starts_with = track_lower.str.startswith(q)
    exact = track_lower == q
    matches = matches.assign(_exact=exact, _starts=starts_with)
    matches = matches.sort_values(
        by=["_exact", "_starts", "popularity"], ascending=[False, False, False]
    )

    return [_row_to_summary(r) for _, r in matches.head(limit).iterrows()]


def get_song(song_id: int) -> dict:
    bundle: ModelBundle = get_bundle()
    songs = bundle.songs
    match = songs.loc[songs["song_id"] == song_id]
    if match.empty:
        raise SongNotFoundError(f"No song with id {song_id}.")
    row = match.iloc[0]
    detail = _row_to_summary(row)
    for field in [
        "danceability",
        "energy",
        "tempo",
        "valence",
        "acousticness",
        "instrumentalness",
        "liveness",
        "loudness",
        "popularity",
        "duration_ms",
    ]:
        value = row.get(field)
        detail[field] = None if value is None or (isinstance(value, float) and math.isnan(value)) else float(value)
    return detail


def _resolve_query_song(bundle: ModelBundle, track_name: str, song_id: int | None) -> pd.Series:
    songs = bundle.songs

    if song_id is not None:
        match = songs.loc[songs["song_id"] == song_id]
        if match.empty:
            raise SongNotFoundError(f"No song with id {song_id}.")
        return match.iloc[0]

    name = (track_name or "").strip().lower()
    if not name:
        raise SongNotFoundError("track_name must not be empty.")

    exact = songs.loc[songs["track_name"].str.lower() == name]
    if not exact.empty:
        # Prefer the most popular version when a title is ambiguous
        # (the dataset can contain the same title from multiple artists).
        return exact.sort_values("popularity", ascending=False).iloc[0]

    partial = songs.loc[songs["track_name"].str.lower().str.contains(name, regex=False, na=False)]
    if not partial.empty:
        return partial.sort_values("popularity", ascending=False).iloc[0]

    raise SongNotFoundError(f'No song matching "{track_name}".')


def get_recommendations(
    track_name: str, n: int = 5, song_id: int | None = None
) -> tuple[dict, list[dict]]:
    """Return (query_song, recommendations) for the given track.

    Uses the pre-fit NearestNeighbors index rather than a full similarity
    matrix: only one sparse row is pulled out of the training matrix and
    passed to `kneighbors`.
    """
    if n < 1 or n > 50:
        raise ValueError("n must be between 1 and 50.")

    bundle = get_bundle()
    query_row = _resolve_query_song(bundle, track_name, song_id)
    idx = int(query_row.name)  # positional row index, aligned with nn_model._fit_X

    feature_row = bundle.nn_model._fit_X[idx]  # noqa: SLF001 - reuse pre-fit sparse matrix, no recompute
    # Ask for a few extra neighbors so we can drop the query song itself
    # (which is always its own nearest neighbor at distance 0) and any
    # accidental exact-duplicate rows, while still returning n results.
    k = min(n + 5, bundle.nn_model.n_samples_fit_)
    distances, indices = bundle.nn_model.kneighbors(feature_row, n_neighbors=k)

    songs = bundle.songs
    results: list[dict] = []
    seen_keys = {query_row["_search_key"]}
    for dist, neighbor_idx in zip(distances[0], indices[0]):
        if neighbor_idx == idx:
            continue
        neighbor = songs.iloc[int(neighbor_idx)]
        key = neighbor["_search_key"]
        if key in seen_keys:
            continue
        seen_keys.add(key)
        similarity = round(max(0.0, 1.0 - float(dist)), 4)
        item = _row_to_summary(neighbor)
        item["similarity"] = similarity
        results.append(item)
        if len(results) >= n:
            break

    query_song = _row_to_summary(query_row)
    return query_song, results
