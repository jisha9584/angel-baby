'use client'

/**
 * DayCounter
 *
 * A gentle odometer that rolls up to the number of days since Rudraksh left.
 * Each digit slides into place from below — a quiet "and still, time keeps
 * moving, and so do we." Computed client-side so it's always current.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDaysSincePassing } from '@/config/memorial'

const DIGIT_H = 56 // px — must match the digit line-height below

function Reel({ digit, index }: { digit: number; index: number }) {
  return (
    <span
      className="relative inline-block overflow-hidden align-top"
      style={{ height: DIGIT_H, width: '0.66em' }}
    >
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        initial={{ y: 0 }}
        animate={{ y: -digit * DIGIT_H }}
        transition={{ duration: 1.7, delay: 0.3 + index * 0.16, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} style={{ height: DIGIT_H, lineHeight: `${DIGIT_H}px` }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

export default function DayCounter() {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    setDays(getDaysSincePassing())
  }, [])

  const digits = days === null ? [] : String(days).split('').map(Number)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2.5"
    >
      <p className="font-display text-[8px] tracking-[0.5em] uppercase text-purple-300/45">
        today is
      </p>

      <div
        className="flex items-baseline gap-3 text-purple-100/90"
        style={{ minHeight: DIGIT_H }}
      >
        <span
          className="font-display tabular-nums leading-none"
          style={{ fontSize: 44 }}
        >
          {digits.map((d, i) => (
            <Reel key={i} digit={d} index={i} />
          ))}
        </span>
        <span className="font-handwriting text-3xl text-purple-300/60">days</span>
      </div>

      <p className="font-body text-sm text-purple-100/45 max-w-[18rem] text-center leading-relaxed">
        and still, somehow, breathing.
      </p>
    </motion.div>
  )
}
