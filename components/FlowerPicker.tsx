'use client'

/**
 * FlowerPicker
 *
 * A quiet, elegant bouquet builder. Tap a flower to gather it (up to 5),
 * tap again to set it down. The live bouquet sits on a soft glow pedestal,
 * and the meaning of each chosen flower unfolds beneath.
 *
 * Two variants:
 *   - 'memory' — warm card tiles, a little fuller, for the garden.
 *   - 'letter' — airy and label-light, to sit gently inside a letter.
 *
 * Flowers are mostly purple — Rudraksh's favourite colour.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { FLOWERS, FlowerSVG, getFlower } from '@/data/flowers'
import BouquetDisplay from '@/components/BouquetDisplay'

const MAX = 5

interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
  variant?: 'memory' | 'letter'
}

export default function FlowerPicker({ selected, onChange, variant = 'memory' }: Props) {
  const isLetter = variant === 'letter'

  function toggle(id: string) {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id))
    else if (selected.length < MAX) onChange([...selected, id])
  }

  const flowerSize = isLetter ? 30 : 36

  return (
    <div className="space-y-6">
      {/* ── Live bouquet on a soft pedestal ──────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="relative flex items-end justify-center"
          style={{ minHeight: isLetter ? 100 : 150 }}
        >
          {/* glow pedestal */}
          <div
            aria-hidden="true"
            className="absolute bottom-1 h-10 w-44 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
          <AnimatePresence mode="wait">
            {selected.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-handwriting text-2xl text-warm-brown/30 pb-6"
              >
                an empty vase, for now
              </motion.p>
            ) : (
              <motion.div
                key="bouquet"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <BouquetDisplay flowerIds={selected} size={isLetter ? 'sm' : 'md'} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-display text-[8px] tracking-[0.3em] uppercase text-light-brown/45">
          {selected.length === 0 ? 'choose up to five' : `${selected.length} of ${MAX} gathered`}
        </p>
      </div>

      {/* ── Flower grid — clean, label-free tiles ────────────────────────── */}
      <div className="grid grid-cols-5 gap-2.5">
        {FLOWERS.map((flower) => {
          const isSel  = selected.includes(flower.id)
          const isFull = selected.length >= MAX && !isSel

          return (
            <motion.button
              key={flower.id}
              type="button"
              onClick={() => toggle(flower.id)}
              disabled={isFull}
              whileHover={isFull ? undefined : { scale: 1.06 }}
              whileTap={isFull ? undefined : { scale: 0.95 }}
              aria-label={`${isSel ? 'Remove' : 'Add'} ${flower.name}`}
              title={`${flower.name} · ${flower.meaning}`}
              className={`
                relative aspect-square flex items-center justify-center rounded-2xl
                transition-all duration-200 focus:outline-none
                focus-visible:ring-2 focus-visible:ring-amber-400/70
                ${isSel
                  ? 'bg-amber-50/70 ring-1 ring-amber-300/70 shadow-soft'
                  : isFull
                    ? 'opacity-30 cursor-not-allowed'
                    : isLetter
                      ? 'hover:bg-warm-brown/5'
                      : 'bg-card-bg/50 hover:bg-warm-yellow/25'}
              `}
            >
              <FlowerSVG id={flower.id} size={flowerSize} />

              <AnimatePresence>
                {isSel && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.3 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shadow-soft"
                  >
                    <Check className="h-2 w-2 text-white" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* ── What the bouquet says ────────────────────────────────────────── */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={isLetter ? 'space-y-1.5 pt-1' : 'rounded-2xl bg-warm-yellow/15 px-4 py-3.5 space-y-1.5'}>
              <p className="font-display text-[8px] tracking-[0.3em] uppercase text-amber-600/65 mb-2">
                what your bouquet says
              </p>
              {selected.map((id) => {
                const f = getFlower(id)
                if (!f) return null
                return (
                  <p
                    key={id}
                    className="font-body text-xs text-light-brown/75 leading-relaxed flex items-baseline gap-2"
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 translate-y-[2px]"
                      style={{ background: f.colors.primary }}
                    />
                    <span>
                      <span className="font-semibold text-warm-brown/85">{f.name}</span>
                      {' · '}
                      {f.meaning}
                    </span>
                  </p>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
