'use client'

import { motion } from 'framer-motion'
import { memorialConfig } from '@/config/memorial'

const TRANSITION_INDEX = 3 // milestones 0-2 render on dark bg, 3+ on cream

export default function ScrollStory() {
  const { milestones } = memorialConfig

  return (
    <section className="relative story-gradient overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-32">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-[8px] tracking-[0.55em] uppercase text-purple-300/45 text-center mb-24"
        >
          his story
        </motion.p>

        <div className="relative">
          {milestones.map((m, i) => {
            const isLast = i === milestones.length - 1
            const onDark = i < TRANSITION_INDEX

            const textMain = onDark ? 'text-white/82'       : 'text-warm-brown/85'
            const textSub  = onDark ? 'text-purple-100/48'  : 'text-light-brown/68'
            const labelClr = onDark ? 'text-purple-300/48'  : 'text-amber-500/58'
            const dotColor = isLast
              ? (onDark ? 'rgba(196,181,253,0.3)' : 'rgba(251,191,36,0.35)')
              : (onDark ? '#a78bfa' : '#f59e0b')
            const dotGlow  = !isLast && onDark ? '0 0 10px rgba(167,139,250,0.7)' : 'none'
            const lineFrom = onDark ? 'rgba(167,139,250,0.35)' : 'rgba(251,191,36,0.3)'

            return (
              <div key={i} className="flex gap-6 items-start">

                {/* Timeline dot + connector */}
                <div className="flex-shrink-0 flex flex-col items-center" style={{ paddingTop: 7 }}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dotColor, boxShadow: dotGlow }}
                  />
                  {!isLast && (
                    <div
                      className="w-px mt-3 flex-shrink-0"
                      style={{
                        height: 96,
                        background: `linear-gradient(to bottom, ${lineFrom}, transparent)`,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="pb-14"
                >
                  <p className={`font-display text-[8px] tracking-[0.38em] uppercase mb-2 ${labelClr}`}>
                    {m.year}
                  </p>
                  <h3 className={`font-handwriting text-[1.6rem] mb-2 leading-tight ${textMain}`}>
                    {m.title}
                  </h3>
                  <p className={`font-body text-sm leading-relaxed max-w-md ${textSub}`}>
                    {m.description}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Bridge to the garden */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-warm-yellow/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
            <div className="h-px w-12 bg-warm-yellow/40" />
          </div>
          <p className="font-handwriting text-xl text-warm-brown/58 mb-1">
            his memory lives in every person he touched
          </p>
          <p className="font-display text-[7px] tracking-[0.4em] uppercase text-warm-brown/28 mt-2">
            scroll to enter the garden ↓
          </p>
        </motion.div>
      </div>
    </section>
  )
}
