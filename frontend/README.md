# MelodyMatch — Frontend

React + Vite + TypeScript + Tailwind CSS frontend for MelodyMatch, a
content-based music discovery app.

## Tech stack

- React 18, Vite, TypeScript
- Tailwind CSS (custom dark theme — see `tailwind.config.js`)
- React Router
- Axios
- lucide-react icons

## Project structure

```
src/
├── components/     Reusable UI: Navbar, SearchBar, RecommendationCard,
│                   MusicPlayer, FavoriteButton, EmptyState, etc.
├── pages/          Home, Discover, Recommendations, Favorites, About, NotFound
├── services/       api.ts — Axios client + typed API calls
├── hooks/          useDebouncedValue, useFavorites, useRecentSearches,
│                   usePlayerContext (the bottom player's state)
├── utils/          localStorage read/write helpers
├── types.ts        Shared TypeScript types matching the backend schemas
├── App.tsx
└── main.tsx
```

## Setup

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your backend
```

## Run

```bash
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend is running (see
`../backend/README.md`) and that `VITE_API_URL` in `.env` points at it —
by default `http://localhost:8000`.

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Notes

- **Favorites** and **recent searches** are stored in `localStorage`, so
  they persist across refreshes but are local to the browser.
- The bottom **music player** embeds Spotify's official embed widget
  (`open.spotify.com/embed/track/{id}`) using each song's Spotify track ID
  from the dataset, so play/pause/seek/volume are Spotify's own real,
  licensed 30-second previews — not a fake simulation. If a song has no
  `spotify_id`, the bar shows the track info with a "no preview available"
  note instead of a broken player.
- Search is debounced (300ms) to avoid firing a request on every keystroke.
- `song_id` is passed alongside `track_name` when following a search result
  so recommendations resolve the exact song, even when multiple artists
  share a title.
