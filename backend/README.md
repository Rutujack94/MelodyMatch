# MelodyMatch API

FastAPI backend for MelodyMatch, a content-based music recommendation
service. Given a song title, it returns similar tracks using a TF-IDF +
NearestNeighbors model trained on ~130,663 songs.

## Why no similarity matrix?

A full pairwise cosine similarity matrix over 130,663 songs would be a
130,663 x 130,663 matrix — tens of billions of floats, which does not fit in
memory. Instead, this API reuses a `NearestNeighbors` index (scikit-learn,
`metric="cosine"`) that was already fit on the TF-IDF matrix of every song's
tags at training time. At request time we pull exactly one row out of that
pre-fit matrix and ask the index for its nearest neighbors — no
recomputation, no NxN matrix, just a single fast lookup.

## Project structure

```
backend/
├── app/
│   ├── main.py                       FastAPI app, CORS, lifespan startup
│   ├── routes/
│   │   ├── search.py                 GET /search
│   │   ├── recommendations.py        GET /recommend
│   │   └── songs.py                  GET /song/{song_id}
│   ├── services/
│   │   └── recommendation_service.py Search + recommendation logic
│   ├── models/
│   │   └── schemas.py                Pydantic request/response models
│   └── utils/
│       └── model_loader.py           Loads the .pkl files exactly once
├── models/
│   ├── tfidf.pkl
│   ├── text_model.pkl
│   ├── scaler.pkl
│   └── songs.pkl
├── requirements.txt
└── README.md
```

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # adjust CORS_ORIGINS if needed
```

## Run

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs
at `http://localhost:8000/docs`.

## Endpoints

| Method | Path                | Description                                     |
|--------|---------------------|--------------------------------------------------|
| GET    | `/`                 | Liveness message                                  |
| GET    | `/health`           | `{"status": "healthy"}` once models are loaded    |
| GET    | `/search`           | `?q=&limit=` — search songs by title/artist       |
| GET    | `/recommend`        | `?track_name=&n=&song_id=` — get recommendations  |
| GET    | `/song/{song_id}`   | Full details for one song                         |

`song_id` is the dataset row index and is useful to disambiguate the (fairly
common) case of two different artists having released a song with the same
title — `/search` always returns it so the frontend can pass it straight
into `/recommend`.

## Configuration

All configuration lives in `.env` (see `.env.example`):

- `CORS_ORIGINS` — comma-separated list of origins allowed to call the API.
- `MODELS_DIR` — where to look for the four `.pkl` files (defaults to
  `backend/models`).

## Performance notes

- Models are loaded once, in FastAPI's `lifespan` startup hook — never per
  request.
- Recommendations never materialize a full similarity matrix; each request
  does a single `NearestNeighbors.kneighbors()` call against one row.
- Search matches on a precomputed lowercase `track + artist` string so no
  per-request string work is duplicated across rows.
