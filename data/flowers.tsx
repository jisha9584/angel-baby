/**
 * Flower definitions for the bouquet builder.
 *
 * Each flower has:
 *   - id / name / meaning
 *   - a color palette (mostly purples — Rudraksh's favourite)
 *   - an SVG render function sized to a 60x72 viewBox
 *
 * Flowers are intentionally soft and slightly imperfect — hand-drawn feeling,
 * not clip-art precision.
 */

import React from 'react'

export interface Flower {
  id:      string
  name:    string
  meaning: string
  colors:  { primary: string; petal: string; center: string; stem: string }
}

export const FLOWERS: Flower[] = [
  {
    id: 'violet',
    name: 'Violet',
    meaning: 'faithfulness, forever in thought',
    colors: { primary: '#7C3AED', petal: '#8B5CF6', center: '#FDE68A', stem: '#4ADE80' },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    meaning: 'devotion, serenity, remembrance',
    colors: { primary: '#A78BFA', petal: '#C4B5FD', center: '#A78BFA', stem: '#4ADE80' },
  },
  {
    id: 'iris',
    name: 'Iris',
    meaning: 'hope, wisdom, cherished friendship',
    colors: { primary: '#6D28D9', petal: '#7C3AED', center: '#FEF3C7', stem: '#22C55E' },
  },
  {
    id: 'wisteria',
    name: 'Wisteria',
    meaning: 'longing, poetry, tender love',
    colors: { primary: '#9333EA', petal: '#C084FC', center: '#DDD6FE', stem: '#4ADE80' },
  },
  {
    id: 'lilac',
    name: 'Lilac',
    meaning: 'first love, youthful innocence',
    colors: { primary: '#C084FC', petal: '#E9D5FF', center: '#F5F3FF', stem: '#4ADE80' },
  },
  {
    id: 'rose',
    name: 'Rose',
    meaning: 'deep love, gratitude, admiration',
    colors: { primary: '#DB2777', petal: '#EC4899', center: '#FFF1F2', stem: '#4ADE80' },
  },
  {
    id: 'daisy',
    name: 'Daisy',
    meaning: 'cheerfulness, new beginnings',
    colors: { primary: '#FFFFFF', petal: '#F1F5F9', center: '#FCD34D', stem: '#4ADE80' },
  },
  {
    id: 'forgetmenot',
    name: 'Forget-me-not',
    meaning: 'true love, memories that never fade',
    colors: { primary: '#3B82F6', petal: '#BFDBFE', center: '#FDE68A', stem: '#4ADE80' },
  },
  {
    id: 'marigold',
    name: 'Marigold',
    meaning: 'warmth, celebration, bright spirit',
    colors: { primary: '#F59E0B', petal: '#FCD34D', center: '#F97316', stem: '#4ADE80' },
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    meaning: 'grace, elegance, sweet memories',
    colors: { primary: '#FEF9C3', petal: '#FFFFFF', center: '#FDE68A', stem: '#4ADE80' },
  },
  {
    id: 'orchid',
    name: 'Orchid',
    meaning: 'rare beauty, strength, admiration',
    colors: { primary: '#7C3AED', petal: '#A855F7', center: '#FDE68A', stem: '#22C55E' },
  },
  {
    id: 'tulip',
    name: 'Tulip',
    meaning: 'perfect love, cheerful thoughts',
    colors: { primary: '#6D28D9', petal: '#8B5CF6', center: '#DDD6FE', stem: '#4ADE80' },
  },
  {
    id: 'bluebell',
    name: 'Bluebell',
    meaning: 'constancy, everlasting love',
    colors: { primary: '#4F46E5', petal: '#818CF8', center: '#E0E7FF', stem: '#4ADE80' },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    meaning: 'fleeting beauty, a life fully lived',
    colors: { primary: '#F9A8D4', petal: '#FBCFE8', center: '#FDE68A', stem: '#4ADE80' },
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    meaning: 'warmth, loyalty, pure joy',
    colors: { primary: '#FBBF24', petal: '#FDE68A', center: '#92400E', stem: '#4ADE80' },
  },
]

export function getFlower(id: string) {
  return FLOWERS.find((f) => f.id === id)
}

// ─── Individual flower SVGs ────────────────────────────────────────────────────
// Each renders into a 60×72 viewBox. The stem occupies roughly the bottom 20px,
// and the bloom sits in the upper 52px.

function Violet({ c }: { c: Flower['colors'] }) {
  // 5 rounded petals rotated around (30,28)
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72 * Math.PI) / 180
    const cx    = 30 + 13 * Math.sin(angle)
    const cy    = 28 - 13 * Math.cos(angle)
    return (
      <ellipse
        key={i}
        cx={cx} cy={cy} rx={9} ry={12}
        fill={i < 2 ? c.primary : c.petal}
        transform={`rotate(${i * 72}, ${cx}, ${cy})`}
        opacity={0.9}
      />
    )
  })
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {petals}
      <circle cx="30" cy="28" r="7" fill={c.center} />
      <circle cx="30" cy="28" r="3" fill="#F59E0B" opacity="0.6" />
      {/* Stem */}
      <path d="M30 52 C30 58 28 62 28 68" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Lavender({ c }: { c: Flower['colors'] }) {
  // Sprig: central stem with small oval buds alternating left/right
  const buds = [
    { x: 24, y: 14, r: 3.5 }, { x: 36, y: 20, r: 3.5 },
    { x: 23, y: 26, r: 3 },   { x: 37, y: 30, r: 3 },
    { x: 24, y: 36, r: 2.5 }, { x: 36, y: 39, r: 2.5 },
    { x: 30, y: 10, r: 4 },
  ]
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 10 L30 58" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
      {/* Small leaf */}
      <ellipse cx="22" cy="50" rx="6" ry="3" fill={c.stem} opacity="0.7"
        transform="rotate(-30, 22, 50)" />
      <ellipse cx="38" cy="54" rx="6" ry="3" fill={c.stem} opacity="0.7"
        transform="rotate(30, 38, 54)" />
      {buds.map((b, i) => (
        <ellipse key={i} cx={b.x} cy={b.y} rx={b.r} ry={b.r * 1.5}
          fill={i === 6 ? c.primary : c.petal}
          opacity={0.85 + (i % 2) * 0.1}
        />
      ))}
      {/* Stem to bottom */}
      <path d="M30 58 C30 62 29 66 29 70" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Iris({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3 falling petals */}
      <ellipse cx="30" cy="42" rx="11" ry="8"  fill={c.petal}    transform="rotate(-50, 30, 42)" opacity="0.9" />
      <ellipse cx="30" cy="42" rx="11" ry="8"  fill={c.petal}    transform="rotate(50, 30, 42)"  opacity="0.9" />
      <ellipse cx="30" cy="46" rx="11" ry="8"  fill={c.primary}  opacity="0.85" />
      {/* 3 upright petals */}
      <ellipse cx="20" cy="22" rx="8"  ry="15" fill={c.primary}  transform="rotate(-20, 20, 22)" opacity="0.9" />
      <ellipse cx="40" cy="22" rx="8"  ry="15" fill={c.primary}  transform="rotate(20, 40, 22)"  opacity="0.9" />
      <ellipse cx="30" cy="16" rx="8"  ry="16" fill={c.petal}    opacity="0.9" />
      {/* Center detail */}
      <ellipse cx="30" cy="32" rx="4"  ry="6"  fill={c.center} opacity="0.7" />
      {/* Stem */}
      <path d="M30 52 C30 58 29 63 29 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Wisteria({ c }: { c: Flower['colors'] }) {
  // Cascading oval clusters hanging from a point
  const clusters = [
    { x: 30, y: 14, ry: 5 },
    { x: 20, y: 22, ry: 8 }, { x: 40, y: 22, ry: 8 },
    { x: 15, y: 34, ry: 9 }, { x: 30, y: 32, ry: 10 }, { x: 45, y: 34, ry: 9 },
    { x: 22, y: 46, ry: 7 }, { x: 38, y: 46, ry: 7 },
  ]
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Branching stems */}
      <path d="M30 10 C28 18 20 20 16 30" stroke={c.stem} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 10 C32 18 40 20 44 30" stroke={c.stem} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 10 L30 28" stroke={c.stem} strokeWidth="1.5" strokeLinecap="round" />
      {clusters.map((cl, i) => (
        <ellipse key={i} cx={cl.x} cy={cl.y} rx={5.5} ry={cl.ry}
          fill={i < 3 ? c.primary : c.petal} opacity={0.7 + (i % 3) * 0.1}
        />
      ))}
      <path d="M30 55 C30 60 29 65 29 70" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Lilac({ c }: { c: Flower['colors'] }) {
  // Cone of tiny 4-petal florets
  const florets = [
    { x: 30, y: 12 }, { x: 22, y: 18 }, { x: 38, y: 18 },
    { x: 16, y: 25 }, { x: 30, y: 24 }, { x: 44, y: 25 },
    { x: 20, y: 32 }, { x: 30, y: 33 }, { x: 40, y: 32 },
    { x: 25, y: 40 }, { x: 35, y: 40 },
  ]
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {florets.map((f, i) => (
        <g key={i}>
          <ellipse cx={f.x}     cy={f.y - 3.5} rx={3.5} ry={4.5} fill={c.petal} opacity="0.85" />
          <ellipse cx={f.x}     cy={f.y + 3.5} rx={3.5} ry={4.5} fill={c.petal} opacity="0.85" />
          <ellipse cx={f.x - 3.5} cy={f.y} rx={4.5} ry={3.5} fill={c.primary} opacity="0.8" />
          <ellipse cx={f.x + 3.5} cy={f.y} rx={4.5} ry={3.5} fill={c.primary} opacity="0.8" />
          <circle cx={f.x} cy={f.y} r={2} fill={c.center} opacity="0.9" />
        </g>
      ))}
      <path d="M30 48 C30 55 29 62 29 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Rose({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx  = 30 + 16 * Math.sin(rad)
        const cy  = 28 - 16 * Math.cos(rad)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={9} ry={13}
            fill={c.petal}
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            opacity={0.75}
          />
        )
      })}
      {/* Mid petals */}
      {[22, 94, 166, 238, 310].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx  = 30 + 9 * Math.sin(rad)
        const cy  = 28 - 9 * Math.cos(rad)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={7.5} ry={11}
            fill={c.primary}
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            opacity={0.85}
          />
        )
      })}
      {/* Inner bud */}
      <circle cx="30" cy="28" r="7" fill={c.primary} />
      <ellipse cx="30" cy="24" rx="5" ry="7" fill={c.petal} opacity="0.6" />
      <path d="M30 52 C30 58 29 64 28 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="23" cy="61" rx="7" ry="4" fill={c.stem} opacity="0.6"
        transform="rotate(-35, 23, 61)" />
    </svg>
  )
}

function Daisy({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 12 thin petals */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const cx    = 30 + 16 * Math.sin(angle)
        const cy    = 26 - 16 * Math.cos(angle)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={4} ry={9}
            fill={c.petal}
            stroke={c.primary} strokeWidth="0.5"
            transform={`rotate(${i * 30}, ${cx}, ${cy})`}
            opacity={0.9}
          />
        )
      })}
      {/* Yellow center */}
      <circle cx="30" cy="26" r="9"  fill={c.center} />
      <circle cx="30" cy="26" r="6"  fill="#F59E0B" />
      <circle cx="30" cy="26" r="3"  fill="#D97706" />
      <path d="M30 50 C30 56 28 62 28 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="22" cy="60" rx="7" ry="4" fill={c.stem} opacity="0.6"
        transform="rotate(-40, 22, 60)" />
    </svg>
  )
}

function Forgetmenot({ c }: { c: Flower['colors'] }) {
  // Cluster of small 5-petal flowers
  const blooms = [
    { x: 30, y: 15 },
    { x: 18, y: 24 }, { x: 42, y: 24 },
    { x: 12, y: 36 }, { x: 30, y: 32 }, { x: 48, y: 36 },
    { x: 20, y: 44 }, { x: 40, y: 44 },
  ]
  function MiniBloom({ x, y }: { x: number; y: number }) {
    return (
      <g>
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const px  = x + 6 * Math.sin(rad)
          const py  = y - 6 * Math.cos(rad)
          return (
            <ellipse key={i} cx={px} cy={py} rx={3.5} ry={5}
              fill={i % 2 === 0 ? c.primary : c.petal}
              transform={`rotate(${angle}, ${px}, ${py})`}
              opacity={0.85}
            />
          )
        })}
        <circle cx={x} cy={y} r={3} fill={c.center} />
      </g>
    )
  }
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Light stems to each bloom */}
      {blooms.map((b, i) => (
        <line key={i} x1={30} y1={52} x2={b.x} y2={b.y + 6}
          stroke={c.stem} strokeWidth="1" opacity="0.5" />
      ))}
      {blooms.map((b, i) => <MiniBloom key={i} x={b.x} y={b.y} />)}
      <path d="M30 52 C30 58 29 64 29 70" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Marigold({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals — 14 */}
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i * (360 / 14) * Math.PI) / 180
        const cx    = 30 + 17 * Math.sin(angle)
        const cy    = 27 - 17 * Math.cos(angle)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={5} ry={10}
            fill={c.petal}
            transform={`rotate(${i * (360 / 14)}, ${cx}, ${cy})`}
            opacity={0.8}
          />
        )
      })}
      {/* Inner petals — 10 */}
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i * 36 * Math.PI) / 180
        const cx    = 30 + 10 * Math.sin(angle)
        const cy    = 27 - 10 * Math.cos(angle)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={4.5} ry={8}
            fill={c.primary}
            transform={`rotate(${i * 36}, ${cx}, ${cy})`}
            opacity={0.9}
          />
        )
      })}
      <circle cx="30" cy="27" r="8"  fill={c.center} />
      <circle cx="30" cy="27" r="5"  fill="#D97706" />
      <path d="M30 50 C30 56 29 63 28 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="22" cy="61" rx="8" ry="4" fill={c.stem} opacity="0.6"
        transform="rotate(-40, 22, 61)" />
    </svg>
  )
}

function Jasmine({ c }: { c: Flower['colors'] }) {
  const blooms = [
    { x: 30, y: 12 },
    { x: 16, y: 22 }, { x: 44, y: 22 },
    { x: 10, y: 34 }, { x: 30, y: 30 }, { x: 50, y: 34 },
    { x: 20, y: 44 }, { x: 40, y: 44 },
  ]
  function StarBloom({ x, y }: { x: number; y: number }) {
    return (
      <g>
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const px  = x + 7 * Math.sin(rad)
          const py  = y - 7 * Math.cos(rad)
          return (
            <ellipse key={i} cx={px} cy={py} rx={3} ry={5.5}
              fill={c.petal}
              stroke={c.primary} strokeWidth="0.4"
              transform={`rotate(${angle}, ${px}, ${py})`}
            />
          )
        })}
        <circle cx={x} cy={y} r={3.5} fill={c.center} />
        {/* Stamens */}
        {[0, 120, 240].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <line key={i}
              x1={x} y1={y}
              x2={x + 4 * Math.sin(rad)}
              y2={y - 4 * Math.cos(rad)}
              stroke="#D97706" strokeWidth="0.8"
            />
          )
        })}
      </g>
    )
  }
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {blooms.map((b, i) => (
        <line key={i} x1={30} y1={52} x2={b.x} y2={b.y + 8}
          stroke={c.stem} strokeWidth="1" opacity="0.4" />
      ))}
      {blooms.map((b, i) => <StarBloom key={i} x={b.x} y={b.y} />)}
      <path d="M30 52 C30 58 29 64 28 70" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Orchid({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Two wide wing petals */}
      <ellipse cx="13" cy="26" rx="12" ry="6" fill={c.petal} opacity="0.85"
        transform="rotate(-20, 13, 26)" />
      <ellipse cx="47" cy="26" rx="12" ry="6" fill={c.petal} opacity="0.85"
        transform="rotate(20, 47, 26)" />
      {/* Two upper petals */}
      <ellipse cx="20" cy="14" rx="8" ry="13" fill={c.primary} opacity="0.9"
        transform="rotate(-30, 20, 14)" />
      <ellipse cx="40" cy="14" rx="8" ry="13" fill={c.primary} opacity="0.9"
        transform="rotate(30, 40, 14)" />
      {/* Lip / lower petal */}
      <ellipse cx="30" cy="36" rx="9" ry="12" fill={c.primary} opacity="0.95" />
      <ellipse cx="30" cy="40" rx="5" ry="7"  fill={c.center}  opacity="0.8" />
      {/* Column */}
      <ellipse cx="30" cy="26" rx="4" ry="6"  fill={c.center} />
      <circle  cx="30" cy="22" r="3"           fill="#F59E0B" opacity="0.7" />
      <path d="M30 52 C30 58 29 64 29 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Tulip({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals */}
      <ellipse cx="18" cy="26" rx="10" ry="18" fill={c.petal} opacity="0.85"
        transform="rotate(-18, 18, 26)" />
      <ellipse cx="42" cy="26" rx="10" ry="18" fill={c.petal} opacity="0.85"
        transform="rotate(18, 42, 26)" />
      {/* Center petals */}
      <ellipse cx="22" cy="22" rx="9"  ry="20" fill={c.primary} opacity="0.9"
        transform="rotate(-8, 22, 22)" />
      <ellipse cx="38" cy="22" rx="9"  ry="20" fill={c.primary} opacity="0.9"
        transform="rotate(8, 38, 22)" />
      <ellipse cx="30" cy="20" rx="9"  ry="21" fill={c.petal}   opacity="0.9" />
      {/* Leaf */}
      <path d="M30 52 C24 46 18 48 16 54" stroke={c.stem} strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="54" rx="8" ry="4" fill={c.stem} opacity="0.6"
        transform="rotate(-30, 20, 54)" />
      <path d="M30 52 C30 58 29 64 29 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Bluebell({ c }: { c: Flower['colors'] }) {
  const bells = [
    { x: 30, y: 10, angle: 0   },
    { x: 17, y: 20, angle: -30 },
    { x: 43, y: 20, angle: 30  },
    { x: 12, y: 34, angle: -45 },
    { x: 48, y: 34, angle: 45  },
  ]
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arching stems */}
      <path d="M30 52 C26 40 20 32 17 22" stroke={c.stem} strokeWidth="1.2" fill="none" />
      <path d="M30 52 C34 40 40 32 43 22" stroke={c.stem} strokeWidth="1.2" fill="none" />
      <path d="M30 52 C24 38 16 36 12 36" stroke={c.stem} strokeWidth="1.2" fill="none" />
      <path d="M30 52 C36 38 44 36 48 36" stroke={c.stem} strokeWidth="1.2" fill="none" />
      <path d="M30 52 L30 12"              stroke={c.stem} strokeWidth="1.5" />
      {bells.map((b, i) => (
        <g key={i} transform={`rotate(${b.angle}, ${b.x}, ${b.y})`}>
          {/* Bell shape */}
          <path
            d={`M${b.x - 6} ${b.y} Q${b.x - 7} ${b.y + 12} ${b.x} ${b.y + 14} Q${b.x + 7} ${b.y + 12} ${b.x + 6} ${b.y} Q${b.x} ${b.y - 4} ${b.x - 6} ${b.y}`}
            fill={c.primary} opacity="0.85"
          />
          <path
            d={`M${b.x - 4} ${b.y + 1} Q${b.x} ${b.y - 3} ${b.x + 4} ${b.y + 1}`}
            fill={c.petal} opacity="0.6"
          />
          <circle cx={b.x} cy={b.y + 14} r="1.5" fill={c.center} opacity="0.7" />
        </g>
      ))}
      <path d="M30 52 C30 58 29 64 29 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Sakura({ c }: { c: Flower['colors'] }) {
  // Cherry blossom: 5 notched heart-shaped petals
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 * Math.PI) / 180
        const cx    = 30 + 14 * Math.sin(angle)
        const cy    = 26 - 14 * Math.cos(angle)
        return (
          <g key={i} transform={`rotate(${i * 72}, 30, 26)`}>
            {/* Notched petal — two overlapping ellipses */}
            <ellipse cx={30 - 4} cy={10} rx={5.5} ry={10} fill={c.petal}   opacity="0.9" />
            <ellipse cx={30 + 4} cy={10} rx={5.5} ry={10} fill={c.primary} opacity="0.85" />
          </g>
        )
      })}
      {/* Center stamens */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180
        return (
          <line key={i}
            x1={30} y1={26}
            x2={30 + 7 * Math.sin(angle)}
            y2={26 - 7 * Math.cos(angle)}
            stroke="#F59E0B" strokeWidth="0.8"
          />
        )
      })}
      <circle cx="30" cy="26" r="4" fill={c.center} />
      <path d="M30 50 C30 56 29 63 28 70" stroke={c.stem} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Sunflower({ c }: { c: Flower['colors'] }) {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals — 16 */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * (360 / 16) * Math.PI) / 180
        const cx    = 30 + 18 * Math.sin(angle)
        const cy    = 26 - 18 * Math.cos(angle)
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={4} ry={9}
            fill={i % 2 === 0 ? c.primary : c.petal}
            transform={`rotate(${i * (360 / 16)}, ${cx}, ${cy})`}
            opacity={0.88}
          />
        )
      })}
      {/* Dark center */}
      <circle cx="30" cy="26" r="11" fill={c.center} />
      <circle cx="30" cy="26" r="8"  fill="#78350F" />
      {/* Seed pattern dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        return (
          <circle key={i}
            cx={30 + 5 * Math.sin(angle)}
            cy={26 - 5 * Math.cos(angle)}
            r={1} fill="#92400E" opacity="0.6"
          />
        )
      })}
      <path d="M30 50 C30 56 28 63 28 70" stroke={c.stem} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="22" cy="60" rx="8" ry="4" fill={c.stem} opacity="0.6"
        transform="rotate(-40, 22, 60)" />
    </svg>
  )
}

// ─── Public render function ────────────────────────────────────────────────────

const COMPONENTS: Record<string, React.FC<{ c: Flower['colors'] }>> = {
  violet:      Violet,
  lavender:    Lavender,
  iris:        Iris,
  wisteria:    Wisteria,
  lilac:       Lilac,
  rose:        Rose,
  daisy:       Daisy,
  forgetmenot: Forgetmenot,
  marigold:    Marigold,
  jasmine:     Jasmine,
  orchid:      Orchid,
  tulip:       Tulip,
  bluebell:    Bluebell,
  sakura:      Sakura,
  sunflower:   Sunflower,
}

export function FlowerSVG({
  id,
  size = 48,
  className = '',
}: {
  id: string
  size?: number
  className?: string
}) {
  const flower = getFlower(id)
  const Comp   = COMPONENTS[id]
  if (!flower || !Comp) return null
  return (
    <span
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size * (72 / 60) }}
    >
      <Comp c={flower.colors} />
    </span>
  )
}
