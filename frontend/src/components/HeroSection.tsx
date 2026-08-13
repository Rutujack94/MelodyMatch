import type { SongSummary } from '../types'
import { SearchBar } from './SearchBar'

interface HeroSectionProps {
  onSelect?: (song: SongSummary) => void
}

export function HeroSection({ onSelect }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] w-[36rem] h-[36rem] rounded-full border border-gold/10 animate-spin-slow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-10 right-[-4%] w-[26rem] h-[26rem] rounded-full border border-teal/10"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="chip mb-6 inline-flex">
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          130,663 songs indexed
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-cream leading-[1.05] mb-5">
          Discover Music
          <br />
          <span className="text-gold">You&apos;ll Love</span>
        </h1>
        <p className="text-mist text-base sm:text-lg max-w-xl mx-auto mb-9">
          Find songs similar to your favorite tracks using intelligent content-based recommendations.
        </p>
        <SearchBar onSelect={onSelect} size="lg" placeholder="Search for a song…" />
      </div>
    </section>
  )
}
