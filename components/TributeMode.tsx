'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame } from 'lucide-react'
import { isFortyNinthDay, getDaysSincePassing, memorialConfig } from '@/config/memorial'

// Soft floating shape for the backdrop — no emojis
function BackdropShapes() {
  const shapes = [
    { x: '10%', delay: 0,   d: 10, color: 'rgba(255,210,95,' },
    { x: '25%', delay: 0.8, d: 14, color: 'rgba(255,175,85,' },
    { x: '45%', delay: 1.6, d:  8, color: 'rgba(197,218,237,' },
    { x: '65%', delay: 0.4, d: 12, color: 'rgba(200,230,201,' },
    { x: '80%', delay: 2.0, d:  9, color: 'rgba(240,200,230,' },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0"
          style={{ left: s.x }}
          animate={{ y: [0, -700], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 9 + i, delay: s.delay, repeat: Infinity, ease: 'easeOut', times: [0, 0.15, 0.8, 1] }}
        >
          <svg width={s.d} height={s.d} viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="5" fill={`${s.color}0.7)`} />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default function TributeMode() {
  const [visible, setVisible]     = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isFortyNinthDay()) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const days = getDaysSincePassing()
  const showDayCount = days > 0 && days <= 100 && !isFortyNinthDay()

  return (
    <>
      {showDayCount && (
        <div className="w-full bg-amber-50 border-b border-amber-100 text-center py-2">
          <p className="font-display text-[9px] tracking-[0.2em] uppercase text-amber-700/70">
            day {days}. carrying his light forward.
          </p>
        </div>
      )}

      <AnimatePresence>
        {visible && !dismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(254,247,237,0.97) 0%, rgba(197,218,237,0.96) 60%, rgba(200,230,201,0.95) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <BackdropShapes />

            <motion.div
              initial={{ scale: 0.88, y: 28, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.65, type: 'spring', bounce: 0.22 }}
              className="relative max-w-lg w-full bg-card-bg rounded-3xl shadow-hover px-10 py-12 text-center"
            >
              <button
                onClick={() => setDismissed(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-warm-yellow/60 hover:bg-warm-yellow flex items-center justify-center text-warm-brown transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex justify-center mb-6"
              >
                <Flame className="h-12 w-12 text-amber-400" strokeWidth={1.5} />
              </motion.div>

              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">
                Day 49
              </p>

              <h2 className="font-handwriting text-4xl text-warm-brown mb-5 leading-tight">
                We gather in love
              </h2>

              <p className="font-body text-base text-light-brown leading-relaxed mb-4">
                Today is day 49 since {memorialConfig.firstName} left this world.
                A moment to pause, to remember, and to celebrate his journey.
                To give thanks for every moment we shared, and to gently
                carry him forward with all our love.
              </p>

              <p className="font-body text-sm text-light-brown/75 leading-relaxed mb-10">
                May he rest in the warmest, most beautiful light.
              </p>

              <button
                onClick={() => setDismissed(true)}
                className="bg-amber-400 hover:bg-amber-500 text-white font-semibold font-body rounded-full px-8 py-3.5 transition-all duration-200 shadow-soft hover:shadow-hover active:scale-95"
              >
                Enter the Memory Garden
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
