'use client'

/**
 * BouquetDisplay
 *
 * Renders a fan-arranged bouquet of flowers as a single SVG.
 * Flowers splay outward from a central stem, tied with a ribbon bow.
 *
 * Sizes:
 *   sm  — 80px wide  (card thumbnail)
 *   md  — 140px wide (form preview)
 *   lg  — 200px wide (expanded modal)
 */

import { motion } from 'framer-motion'
import { FlowerSVG, getFlower } from '@/data/flowers'

// Fan angles per number of selected flowers
const FAN: Record<number, number[]> = {
  1: [0],
  2: [-18, 18],
  3: [-26, 0, 26],
  4: [-32, -10, 10, 32],
  5: [-36, -18, 0, 18, 36],
}

// Flower size in the bouquet per display size
const SIZES: Record<'sm' | 'md' | 'lg', number> = { sm: 28, md: 44, lg: 58 }
const WRAP_SIZES: Record<'sm' | 'md' | 'lg', number> = { sm: 80, md: 140, lg: 200 }

interface Props {
  flowerIds: string[]
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export default function BouquetDisplay({ flowerIds, size = 'md', animate = true }: Props) {
  const ids     = flowerIds.slice(0, 5)
  const angles  = FAN[ids.length] ?? FAN[5]
  const fSize   = SIZES[size]
  const width   = WRAP_SIZES[size]
  const height  = Math.round(width * 1.4)
  const cx      = width / 2
  const stemBot = height - (size === 'sm' ? 12 : 18) // ribbon y-center
  const stemTop = size === 'sm' ? height * 0.28 : height * 0.24

  if (ids.length === 0) return null

  return (
    <div style={{ width, height }} className="relative flex-shrink-0 select-none">
      {/* ── Stems ────────────────────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="absolute inset-0"
        aria-hidden="true"
      >
        {ids.map((_, i) => {
          const angle = ((angles[i] ?? 0) * Math.PI) / 180
          const tipX  = cx + (stemTop - stemBot) * Math.sin(angle)
          // Bezier: each stem curves from ribbon point to its flower base
          return (
            <path
              key={i}
              d={`M ${cx} ${stemBot} C ${cx + (tipX - cx) * 0.4} ${stemBot - 20}, ${tipX} ${stemTop + 20}, ${tipX} ${stemTop}`}
              stroke="#4ADE80"
              strokeWidth={size === 'sm' ? 1.5 : 2}
              fill="none"
              strokeLinecap="round"
            />
          )
        })}

        {/* ── Wrap / ribbon ──────────────────────────────────────────────── */}
        {/* Binding wrap */}
        <rect
          x={cx - (size === 'sm' ? 8 : 12)}
          y={stemBot - (size === 'sm' ? 10 : 14)}
          width={size === 'sm' ? 16 : 24}
          height={size === 'sm' ? 20 : 28}
          rx={size === 'sm' ? 4 : 6}
          fill="#FDE68A"
          opacity="0.9"
        />

        {/* Ribbon bow loops */}
        <ellipse cx={cx - (size === 'sm' ? 10 : 15)} cy={stemBot - (size === 'sm' ? 4 : 6)}
          rx={size === 'sm' ? 8 : 12} ry={size === 'sm' ? 5 : 7}
          fill="#FCD34D" transform={`rotate(-20, ${cx - 10}, ${stemBot - 5})`} />
        <ellipse cx={cx + (size === 'sm' ? 10 : 15)} cy={stemBot - (size === 'sm' ? 4 : 6)}
          rx={size === 'sm' ? 8 : 12} ry={size === 'sm' ? 5 : 7}
          fill="#FCD34D" transform={`rotate(20, ${cx + 10}, ${stemBot - 5})`} />

        {/* Ribbon knot */}
        <circle cx={cx} cy={stemBot - (size === 'sm' ? 3 : 4)}
          r={size === 'sm' ? 4 : 6} fill="#F59E0B" />

        {/* Ribbon tails */}
        <path
          d={`M ${cx} ${stemBot - 2} C ${cx - (size === 'sm' ? 8 : 12)} ${stemBot + 8}, ${cx - (size === 'sm' ? 14 : 20)} ${stemBot + 14}, ${cx - (size === 'sm' ? 10 : 16)} ${height}`}
          stroke="#F59E0B" strokeWidth={size === 'sm' ? 2 : 3} fill="none" strokeLinecap="round"
        />
        <path
          d={`M ${cx} ${stemBot - 2} C ${cx + (size === 'sm' ? 8 : 12)} ${stemBot + 8}, ${cx + (size === 'sm' ? 14 : 20)} ${stemBot + 14}, ${cx + (size === 'sm' ? 10 : 16)} ${height}`}
          stroke="#F59E0B" strokeWidth={size === 'sm' ? 2 : 3} fill="none" strokeLinecap="round"
        />
      </svg>

      {/* ── Flower heads — positioned absolutely over the SVG ─────────────── */}
      {ids.map((id, i) => {
        const angle = angles[i] ?? 0
        const rad   = (angle * Math.PI) / 180
        const tipX  = cx + (stemTop - stemBot) * Math.sin(rad)
        // Center the flower head over the stem tip
        const left  = tipX - fSize / 2
        const top   = stemTop - fSize * 0.85

        return (
          <motion.div
            key={id + i}
            className="absolute"
            style={{
              left,
              top,
              transform:       `rotate(${angle}deg)`,
              transformOrigin: 'bottom center',
              width:  fSize,
              height: fSize * 1.2,
            }}
            initial={animate ? { scale: 0, opacity: 0 } : undefined}
            animate={animate ? { scale: 1, opacity: 1 } : undefined}
            transition={{ delay: i * 0.12, duration: 0.4, type: 'spring', bounce: 0.4 }}
          >
            <FlowerSVG id={id} size={fSize} />
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Empty state / placeholder ────────────────────────────────────────────────
export function BouquetPlaceholder({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const width  = WRAP_SIZES[size]
  const height = Math.round(width * 1.4)
  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-warm-yellow/40 rounded-2xl bg-warm-yellow/10 text-light-brown/40"
      style={{ width, height }}
    >
      <span className="font-handwriting text-lg leading-tight text-center px-2">
        no bouquet yet
      </span>
    </div>
  )
}
