import { AlertCircle, RotateCcw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-coral" />
      </div>
      <h3 className="text-lg font-semibold text-cream mb-1.5">Something went wrong</h3>
      <p className="text-mist text-sm max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          <RotateCcw size={16} />
          Try again
        </button>
      )}
    </div>
  )
}
