'use client'

/**
 * AmbientBackground
 *
 * A canvas-based ambient particle system that gives the whole site a living,
 * breathing warmth — like memories drifting softly through space.
 *
 * Three layered particle types:
 *
 *   1. Glow orbs  — large, very faint radial blobs that drift slowly.
 *                   Like candlelight blooms in the distance.
 *
 *   2. Sparkles   — medium-sized glowing dots that twinkle and float upward.
 *                   Like tiny lamps or fireflies.
 *
 *   3. Motes      — tiny dust-like points, almost stars.
 *                   Like the shimmer of a holy flame in a dark room.
 *
 * Color palette: warm golds, soft pinks, moonlight whites, and sage greens
 * that feel like candlelight and quiet summer evenings.
 *
 * Performance notes:
 *   - The canvas is fixed, pointer-events-none, and sits behind all content.
 *   - Particle counts are halved on mobile (< 768 px width).
 *   - The animation loop uses requestAnimationFrame and is cancelled on unmount.
 *   - A ResizeObserver keeps the canvas sized to the viewport.
 */

import { useEffect, useRef, useCallback } from 'react'

// ─── Colour palette ────────────────────────────────────────────────────────
// [R, G, B] tuples — alpha is handled per-particle
const PALETTE: [number, number, number][] = [
  [255, 210,  95], // warm gold
  [255, 175,  85], // saffron
  [255, 225, 175], // peach cream
  [255, 205, 180], // soft blush
  [197, 218, 237], // sky blue
  [210, 235, 210], // pale mint
  [255, 248, 220], // moonlight cream
  [240, 200, 230], // lavender blush
  [255, 230, 130], // pale marigold
]

// ─── Types ─────────────────────────────────────────────────────────────────
type Kind = 'orb' | 'sparkle' | 'mote'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number           // radius
  alpha: number       // current opacity
  alphaTarget: number // oscillating toward this
  alphaSpeed: number  // lerp speed
  ci: number          // colour index
  kind: Kind
}

// ─── Factory ───────────────────────────────────────────────────────────────
function make(kind: Kind, W: number, H: number): Particle {
  const ci = Math.floor(Math.random() * PALETTE.length)

  if (kind === 'orb') {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      r: 80 + Math.random() * 130,
      alpha: 0,
      alphaTarget: 0.03 + Math.random() * 0.04,
      alphaSpeed: 0.001 + Math.random() * 0.002,
      ci, kind,
    }
  }

  if (kind === 'sparkle') {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.05 - Math.random() * 0.15, // gentle upward drift
      r: 2 + Math.random() * 3.5,
      alpha: Math.random() * 0.5,       // start mid-twinkle
      alphaTarget: 0.2 + Math.random() * 0.55,
      alphaSpeed: 0.006 + Math.random() * 0.012,
      ci, kind,
    }
  }

  // mote
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -0.02 - Math.random() * 0.08,
    r: 0.6 + Math.random() * 1.6,
    alpha: Math.random() * 0.6,
    alphaTarget: 0.15 + Math.random() * 0.55,
    alphaSpeed: 0.004 + Math.random() * 0.014,
    ci, kind,
  }
}

// ─── Draw helpers ──────────────────────────────────────────────────────────
function drawOrb(ctx: CanvasRenderingContext2D, p: Particle) {
  const [r, g, b] = PALETTE[p.ci]
  const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
  grd.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`)
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  ctx.fill()
}

function drawSparkle(ctx: CanvasRenderingContext2D, p: Particle) {
  const [r, g, b] = PALETTE[p.ci]

  // Outer glow
  const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
  halo.addColorStop(0, `rgba(${r},${g},${b},${p.alpha * 0.5})`)
  halo.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
  ctx.fill()

  // Core
  ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  ctx.fill()
}

function drawMote(ctx: CanvasRenderingContext2D, p: Particle) {
  const [r, g, b] = PALETTE[p.ci]
  ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  ctx.fill()
}

// ─── Component ─────────────────────────────────────────────────────────────
interface Props {
  /**
   * Pass the current number of memories — as the count grows, the scene
   * gradually brightens, symbolising collective memory accumulating.
   */
  memoryCount?: number
}

export default function AmbientBackground({ memoryCount = 0 }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const stateRef   = useRef<{ particles: Particle[]; raf: number }>({
    particles: [],
    raf: 0,
  })

  // Scale max-alpha of sparkles by memory count (capped at +30 %)
  const brightnessBoost = Math.min(memoryCount * 0.003, 0.3)

  const seed = useCallback((W: number, H: number) => {
    const mobile = W < 768
    const orbs     = Array.from({ length: mobile ?  4 :  7 }, () => make('orb',     W, H))
    const sparkles = Array.from({ length: mobile ? 30 : 65 }, () => make('sparkle', W, H))
    const motes    = Array.from({ length: mobile ? 50 : 110 }, () => make('mote',   W, H))
    stateRef.current.particles = [...orbs, ...sparkles, ...motes]
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas to viewport
    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
      seed(canvas!.width, canvas!.height)
    }
    resize()
    window.addEventListener('resize', resize)

    function tick() {
      const { particles } = stateRef.current
      const W = canvas!.width
      const H = canvas!.height

      ctx!.clearRect(0, 0, W, H)

      for (const p of particles) {
        // ── Move ────────────────────────────────────────────────────────
        p.x += p.vx
        p.y += p.vy

        // Wrap: re-enter from the opposite edge with a fresh alpha
        const margin = p.r * 2
        if (p.x < -margin)   { p.x = W + p.r; p.alpha = 0 }
        if (p.x > W + margin){ p.x = -p.r;    p.alpha = 0 }
        if (p.y < -margin)   { p.y = H + p.r; p.alpha = 0 }
        if (p.y > H + margin){ p.y = -p.r;    p.alpha = 0 }

        // ── Twinkle — lerp alpha toward a slowly changing target ───────
        const diff = p.alphaTarget - p.alpha
        if (Math.abs(diff) < p.alphaSpeed * 2) {
          // Reached target: pick a new one
          const boost = p.kind === 'sparkle' ? brightnessBoost : 0
          p.alphaTarget =
            p.kind === 'orb'
              ? 0.02 + Math.random() * 0.04
              : p.kind === 'sparkle'
                ? 0.1  + Math.random() * (0.5 + boost)
                : 0.1  + Math.random() * 0.5
        }
        p.alpha += diff * p.alphaSpeed * 8

        // ── Draw ────────────────────────────────────────────────────────
        if      (p.kind === 'orb')     drawOrb(ctx!, p)
        else if (p.kind === 'sparkle') drawSparkle(ctx!, p)
        else                           drawMote(ctx!, p)
      }

      stateRef.current.raf = requestAnimationFrame(tick)
    }

    stateRef.current.raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(stateRef.current.raf)
    }
  }, [seed, brightnessBoost])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
