'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { memorialConfig } from '@/config/memorial'

const LINKS = [
  { href: '/',           label: 'HOME'        },
  { href: '/memories',   label: 'MEMORIES'    },
  { href: '/add-memory', label: 'ADD MEMORY'  },
  { href: '/timeline',   label: 'TIMELINE'    },
]

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-cream/80 backdrop-blur-md border-b border-border/40 shadow-card">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display text-xs tracking-[0.25em] uppercase text-warm-brown/80 hover:text-warm-brown transition-colors"
          >
            {memorialConfig.firstName}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-full font-display text-[10px] tracking-[0.2em] uppercase transition-all duration-150',
                      active
                        ? 'bg-warm-yellow text-warm-brown'
                        : 'text-light-brown/70 hover:bg-warm-yellow/40 hover:text-warm-brown',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-warm-yellow/40 text-warm-brown transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="md:hidden absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-md border-b border-border/40 shadow-soft px-4 pb-4 pt-2"
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-2xl font-display text-[10px] tracking-[0.2em] uppercase transition-all duration-150',
                        active
                          ? 'bg-warm-yellow text-warm-brown'
                          : 'text-light-brown/70 hover:bg-warm-yellow/40 hover:text-warm-brown',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
