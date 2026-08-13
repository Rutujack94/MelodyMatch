# MelodyMatch

*Discover your next favorite song.*

A full-stack, content-based music recommendation system: search any of
130,663 songs and get back tracks with a similar sound and style — powered
by TF-IDF text features and a pre-fit NearestNeighbors index (no NxN
similarity matrix, ever).

```
Music_Recommendation/
├── backend/    FastAPI service — see backend/README.md
├── frontend/   React + Vite + TypeScript + Tailwind app — see frontend/README.md
└── README.md   (this file)
```

## Quickstart

**1. Backend**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000` (docs at `/docs`).

**2. Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173`.

Open the frontend in your browser, search for a song, and explore.

## What's inside

- **Search** — case-insensitive, partial-match search across track and
  artist name, with a debounced live dropdown.
- **Recommendations** — pick a song and get similarity-ranked matches,
  each shown with a "match ring" indicating percentage similarity.
- **Discover** — trending searches, songs from familiar artists, and a
  "Surprise Me" random-discovery button.
- **Favorites** and **recent searches** — persisted in the browser via
  `localStorage`.
- **Demo music player** — a persistent bottom bar embedding Spotify's
  official player widget for each track's real 30-second preview, using
  the Spotify track ID already present in the dataset.

## Design

Dark theme by default: a warm aubergine background rather than pure black,
with gold, coral, and teal accents evoking vinyl and analog audio gear.
Fraunces for display type, Manrope for body text, IBM Plex Mono for data
(percentages, stats).

## ML approach

See `backend/README.md` for the full explanation of why this system never
builds a full similarity matrix, and instead reuses the pre-fit
`NearestNeighbors` index for every recommendation request.
