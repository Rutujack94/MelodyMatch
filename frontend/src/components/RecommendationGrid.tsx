import type { RecommendationItem } from '../types'
import { RecommendationCard } from './RecommendationCard'

interface RecommendationGridProps {
  items: RecommendationItem[]
}

export function RecommendationGrid({ items }: RecommendationGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <RecommendationCard key={item.song_id} item={item} queue={items} />
      ))}
    </div>
  )
}
