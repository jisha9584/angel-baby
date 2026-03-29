'use client'

/**
 * SparkWall
 *
 * Displays quick "spark" submissions — three words, a feeling, a small truth —
 * as organic scattered tags. Each tag has a seeded soft colour.
 */

import { motion } from 'framer-motion'
import type { Spark } from '@/types'

// Deterministic colour from spark id so server + client agree (no hydration mismatch)
function tagColor(id: string): string {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const palettes = [
    'bg-amber-50  border-amber-200  text-amber-800',
    'bg-purple-50 border-purple-200 text-purple-800',
    'bg-sky-50    border-sky-200    text-sky-800',
    'bg-rose-50   border-rose-200   text-rose-800',
    'bg-emerald-50 border-emerald-200 text-emerald-800',
    'bg-warm-yellow/30 border-warm-yellow text-warm-brown',
    'bg-violet-50 border-violet-200 text-violet-800',
  ]
  return palettes[n % palettes.length]
}

function tagRotation(id: string): number {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const steps = [-2, -1, 0, 1, 2]
  return steps[n % steps.length]
}

interface Props { sparks: Spark[] }

export default function SparkWall({ sparks }: Props) {
  if (sparks.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {sparks.map((spark, i) => (
        <motion.div
          key={spark.id}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1,    y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.6), ease: 'easeOut' }}
          style={{ rotate: tagRotation(spark.id) }}
          className={`
            inline-flex flex-col gap-1 px-4 py-2.5 rounded-2xl border
            shadow-card hover:shadow-soft transition-shadow duration-200
            ${tagColor(spark.id)}
          `}
        >
          <p className="font-body text-sm leading-snug max-w-[220px]">
            {spark.text}
          </p>
          {spark.name && (
            <p className="font-display text-[7px] tracking-[0.2em] uppercase opacity-50">
              {spark.name}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )
}
