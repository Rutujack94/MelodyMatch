export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 animate-pulse">
      <div className="w-full aspect-square rounded-lg bg-white/5 mb-4" />
      <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
  )
}

export function CardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0" />
      <div className="flex-1">
        <div className="h-3.5 bg-white/5 rounded w-2/3 mb-2" />
        <div className="h-3 bg-white/5 rounded w-1/3" />
      </div>
    </div>
  )
}
