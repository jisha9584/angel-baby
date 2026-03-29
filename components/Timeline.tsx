'use client'

/**
 * Timeline
 *
 * A vertical timeline of life milestones.
 * Milestones are defined in config/memorial.ts — update them there.
 *
 * Each milestone card alternates left/right on desktop,
 * and stacks vertically on mobile.
 */

import { motion } from 'framer-motion'
import { memorialConfig } from '@/config/memorial'

// One colour per milestone, cycling through the palette
const CARD_COLOURS = [
  'from-warm-yellow/50 to-warm-yellow/20',
  'from-soft-blue/50   to-soft-blue/20',
  'from-mint-green/50  to-mint-green/20',
  'from-blush/50       to-blush/20',
  'from-warm-yellow/40 to-soft-blue/20',
]

export default function Timeline() {
  const { milestones } = memorialConfig

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical spine */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-warm-yellow via-soft-blue to-mint-green opacity-40 hidden md:block"
        aria-hidden="true"
      />
      {/* Mobile spine */}
      <div
        className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-warm-yellow via-soft-blue to-mint-green opacity-40 md:hidden"
        aria-hidden="true"
      />

      <ol className="relative space-y-12 md:space-y-16">
        {milestones.map((milestone, i) => {
          const isRight = i % 2 === 0

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: isRight ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
              className="relative"
            >
              {/* ── Desktop layout (alternating sides) ────────────────────── */}
              <div className="hidden md:flex items-start gap-0">
                {/* Left side content */}
                <div className={`flex-1 ${isRight ? 'pr-10 text-right' : 'pr-10 opacity-0 pointer-events-none'}`}>
                  {isRight && <MilestoneCard milestone={milestone} colourClass={CARD_COLOURS[i % CARD_COLOURS.length]} />}
                </div>

                {/* Centre dot */}
                <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 shadow-soft border-2 border-card-bg mt-1" />
                </div>

                {/* Right side content */}
                <div className={`flex-1 ${!isRight ? 'pl-10' : 'pl-10 opacity-0 pointer-events-none'}`}>
                  {!isRight && <MilestoneCard milestone={milestone} colourClass={CARD_COLOURS[i % CARD_COLOURS.length]} />}
                </div>
              </div>

              {/* ── Mobile layout (all left-aligned) ──────────────────────── */}
              <div className="md:hidden flex gap-4 pl-4">
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0 mt-1">
                  <div className="w-4 h-4 rounded-full bg-amber-400 shadow-soft border-2 border-card-bg" />
                </div>
                {/* Card */}
                <div className="flex-1">
                  <MilestoneCard
                    milestone={milestone}
                    colourClass={CARD_COLOURS[i % CARD_COLOURS.length]}
                    textLeft
                  />
                </div>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

// ─── Individual milestone card ────────────────────────────────────────────────
function MilestoneCard({
  milestone,
  colourClass,
  textLeft = false,
}: {
  milestone: { year: string; title: string; description: string }
  colourClass: string
  textLeft?: boolean
}) {
  return (
    <div
      className={`bg-gradient-to-br ${colourClass} rounded-2xl p-5 shadow-card ${
        textLeft ? 'text-left' : ''
      }`}
    >
      <span className="inline-block font-display text-[9px] tracking-[0.25em] uppercase text-amber-500/80 mb-2">
        {milestone.year}
      </span>
      <h3 className="font-handwriting text-2xl text-warm-brown mb-2">
        {milestone.title}
      </h3>
      <p className="font-body text-sm text-light-brown leading-relaxed">
        {milestone.description}
      </p>
    </div>
  )
}
