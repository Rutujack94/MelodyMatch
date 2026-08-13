import type { LucideIcon } from 'lucide-react'
import { Music } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon = Music, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Icon size={24} className="text-mist" />
      </div>
      <h3 className="text-lg font-semibold text-cream mb-1.5">{title}</h3>
      {description && <p className="text-mist text-sm max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
