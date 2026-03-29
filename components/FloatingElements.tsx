'use client'

/**
 * FloatingElements — soft SVG shapes that drift upward on the hero.
 * No emojis — each shape is a pure SVG path so it scales crisply
 * at any DPI and feels designed rather than pasted.
 *
 * Three shape types:
 *   circle  — the gentlest, most universal form
 *   cross   — a delicate plus / star shape
 *   diamond — a rotated square that catches light differently
 */

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Shape = 'circle' | 'cross' | 'diamond'

interface FloatEl {
  id: number
  shape: Shape
  left: number    // % from left
  size: number    // px
  delay: number
  duration: number
  color: string
}

const COLORS = [
  'rgba(249,210,95,',   // warm gold
  'rgba(255,175,85,',   // saffron
  'rgba(197,218,237,',  // sky
  'rgba(200,230,201,',  // mint
  'rgba(255,205,180,',  // peach
  'rgba(240,200,230,',  // lavender
]

const ELEMENTS: FloatEl[] = [
  { id:  1, shape: 'circle',  left:  8, size: 10, delay: 0,   duration: 11, color: COLORS[0] },
  { id:  2, shape: 'cross',   left: 17, size: 14, delay: 1.4, duration: 13, color: COLORS[1] },
  { id:  3, shape: 'diamond', left: 29, size:  8, delay: 0.6, duration: 10, color: COLORS[2] },
  { id:  4, shape: 'circle',  left: 43, size: 16, delay: 2.2, duration: 14, color: COLORS[3] },
  { id:  5, shape: 'cross',   left: 56, size: 12, delay: 1.0, duration: 12, color: COLORS[4] },
  { id:  6, shape: 'diamond', left: 68, size: 10, delay: 3.1, duration: 11, color: COLORS[5] },
  { id:  7, shape: 'circle',  left: 78, size:  8, delay: 0.8, duration: 10, color: COLORS[0] },
  { id:  8, shape: 'cross',   left: 87, size: 14, delay: 2.5, duration: 15, color: COLORS[1] },
  { id:  9, shape: 'circle',  left:  4, size: 12, delay: 4.0, duration: 12, color: COLORS[2] },
  { id: 10, shape: 'diamond', left: 51, size:  9, delay: 1.8, duration: 13, color: COLORS[4] },
]

function ShapeSVG({ shape, size, color }: { shape: Shape; size: number; color: string }) {
  const fill = `${color}0.75)`
  if (shape === 'circle') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="5" fill={fill} />
      </svg>
    )
  }
  if (shape === 'cross') {
    // Thin 4-armed cross / plus
    return (
      <svg width={size} height={size} viewBox="0 0 10 10">
        <rect x="4" y="0" width="2" height="10" rx="1" fill={fill} />
        <rect x="0" y="4" width="10" height="2" rx="1" fill={fill} />
      </svg>
    )
  }
  // diamond — rotated square
  return (
    <svg width={size} height={size} viewBox="0 0 10 10">
      <rect x="2.5" y="2.5" width="5" height="5" rx="0.5" fill={fill}
        transform="rotate(45 5 5)" />
    </svg>
  )
}

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {ELEMENTS.map((el) => (
        <motion.div
          key={el.id}
          className="absolute select-none"
          style={{ left: `${el.left}%`, bottom: '-20px' }}
          animate={{
            y:       [0, -880],
            x:       [0, 14, -10, 6, 0],
            opacity: [0, 0.85, 0.85, 0],
            rotate:  [0, 20, -12, 4, 0],
          }}
          transition={{
            duration: el.duration,
            delay:    el.delay,
            repeat:   Infinity,
            ease:     'easeOut',
            times:    [0, 0.12, 0.82, 1],
          }}
        >
          <ShapeSVG shape={el.shape} size={el.size} color={el.color} />
        </motion.div>
      ))}
    </div>
  )
}
