"""Loads the trained ML artifacts exactly once and exposes them as module-level
singletons. FastAPI's lifespan hook calls `load_models()` on startup so the
~35 MB of pickles are read from disk a single time, never per-request.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from pathlib import Path

import joblib
import pandas as pd

logger = logging.getLogger("melodymatch.model_loader")

BACKEND_ROOT = Path(__file__).resolve().parents[2]
MODELS_DIR = Path(os.getenv("MODELS_DIR", BACKEND_ROOT / "models"))


@dataclass
class ModelBundle:
    songs: pd.DataFrame
    tfidf: object
    nn_model: object
    scaler: object


_bundle: ModelBundle | None = None


class ModelLoadError(RuntimeError):
    """Raised when a required model artifact cannot be loaded."""


def load_models() -> ModelBundle:
    """Load all model artifacts from disk. Safe to call multiple times;
    subsequent calls return the cached bundle instead of re-reading disk.
    """
    global _bundle
    if _bundle is not None:
        return _bundle

    required = ["songs.pkl", "tfidf.pkl", "text_model.pkl", "scaler.pkl"]
    missing = [name for name in required if not (MODELS_DIR / name).exists()]
    if missing:
        raise ModelLoadError(
            f"Missing model file(s) in {MODELS_DIR}: {', '.join(missing)}. "
            "Make sure the models/ directory was copied alongside the backend."
        )

    try:
        songs = joblib.load(MODELS_DIR / "songs.pkl")
        tfidf = joblib.load(MODELS_DIR / "tfidf.pkl")
        nn_model = joblib.load(MODELS_DIR / "text_model.pkl")
        scaler = joblib.load(MODELS_DIR / "scaler.pkl")
    except Exception as exc:  # noqa: BLE001 - surface as a clean domain error
        logger.exception("Failed to load model artifacts")
        raise ModelLoadError(f"Failed to load model artifacts: {exc}") from exc

    if not isinstance(songs, pd.DataFrame):
        raise ModelLoadError("songs.pkl did not contain a pandas DataFrame.")

    songs = songs.reset_index(drop=False).rename(columns={"index": "song_id"})
    songs["track_name"] = songs["track_name"].fillna("Untitled")
    songs["artist_name"] = songs["artist_name"].fillna("Unknown Artist")
    songs["_search_key"] = (songs["track_name"] + " " + songs["artist_name"]).str.lower()

    logger.info("Loaded %d songs and models from %s", len(songs), MODELS_DIR)

    _bundle = ModelBundle(songs=songs, tfidf=tfidf, nn_model=nn_model, scaler=scaler)
    return _bundle


def get_bundle() -> ModelBundle:
    if _bundle is None:
        return load_models()
    return _bundle
