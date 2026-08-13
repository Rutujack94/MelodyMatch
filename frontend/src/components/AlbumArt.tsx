import { Music2 } from 'lucide-react'

const GRADIENTS = [
  'from-gold via-coral to-ink-700',
  'from-teal via-ink-700 to-gold',
  'from-coral via-ink-700 to-teal',
  'from-gold-dim via-coral-dim to-ink-800',
  'from-teal via-gold to-ink-800',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

interface AlbumArtProps {
  seed: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: 'w-12 h-12 rounded-lg',
  md: 'w-full aspect-square rounded-xl',
  lg: 'w-16 h-16 rounded-lg',
}

export function AlbumArt({ seed, size = 'md', className = '' }: AlbumArtProps) {
  const gradient = GRADIENTS[hashString(seed) % GRADIENTS.length]
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 28

  return (
    <div
      className={`bg-gradient-to-br ${gradient} ${SIZE_MAP[size]} flex items-center justify-center shrink-0 shadow-card ${className}`}
      aria-hidden="true"
    >
      <Music2 size={iconSize} className="text-ink-950/70" strokeWidth={2} />
    </div>
  )
}
