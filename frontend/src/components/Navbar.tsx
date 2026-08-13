import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Disc3, Heart, Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <Disc3 size={26} className="text-gold animate-spin-slow" strokeWidth={1.75} />
          <span className="font-display text-lg font-semibold tracking-tight text-cream">
            MelodyMatch
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'text-ink-950 bg-gold' : 'text-mist hover:text-cream hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'text-coral bg-coral/10' : 'text-mist hover:text-coral hover:bg-white/5'
              }`
            }
          >
            <Heart size={16} />
            Favorites
          </NavLink>
          <button
            type="button"
            className="md:hidden p-2 text-mist hover:text-cream"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1">
          {[...LINKS, { to: '/favorites', label: 'Favorites' }].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'text-gold bg-white/5' : 'text-mist'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
