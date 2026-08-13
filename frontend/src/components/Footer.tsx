import { Disc3 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-mist">
          <Disc3 size={18} className="text-gold" />
          <span className="text-sm">
            <span className="text-cream font-medium">MelodyMatch</span> — discover your next favorite song.
          </span>
        </div>
        <p className="text-xs text-mist/70 text-center">
          Content-based recommendations powered by TF-IDF &amp; nearest-neighbor search. Not affiliated with Spotify.
        </p>
      </div>
    </footer>
  )
}
