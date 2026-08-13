import { Link } from 'react-router-dom'
import { Disc3 } from 'lucide-react'

export function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-28 text-center">
      <Disc3 size={48} className="text-gold mx-auto mb-6 animate-spin-slow" />
      <h1 className="font-display text-4xl text-cream mb-3">Track not found</h1>
      <p className="text-mist mb-8">
        This page skipped. Let&apos;s get you back to something you&apos;ll actually enjoy.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  )
}
