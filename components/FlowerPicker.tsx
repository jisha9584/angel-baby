'use client'

/**
 * FlowerPicker
 *
 * A grid of all 10 flowers. Click to add to the bouquet (max 5).
 * Click again to remove. Selected flowers show a soft amber ring.
 *
 * Flowers are mostly purple — Rudraksh's favourite colour.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { FLOWERS, FlowerSVG } from '@/data/flowers'
import BouquetDisplay, { BouquetPlaceholder } from '@/components/BouquetDisplay'

const MAX = 5

interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function FlowerPicker({ selected, onChange }: Props) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else if (selected.length < MAX) {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-5">
      {/* Live bouquet preview */}
      <div className="flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          {selected.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BouquetPlaceholder size="md" />
            </motion.div>
          ) : (
            <motion.div key="bouquet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BouquetDisplay flowerIds={selected} size="md" />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="font-display text-[9px] tracking-[0.25em] uppercase text-light-brown/50">
          {selected.length === 0
            ? 'pick up to 5 flowers'
            : `${selected.length} of ${MAX} flowers chosen`}
        </p>
      </div>

      {/* Flower grid */}
      <div className="grid grid-cols-5 gap-2">
        {FLOWERS.map((flower) => {
          const isSelected = selected.includes(flower.id)
          const isFull     = selected.length >= MAX && !isSelected

          return (
            <motion.button
              key={flower.id}
              type="button"
              onClick={() => toggle(flower.id)}
              disabled={isFull}
              whileHover={isFull ? undefined : { scale: 1.08 }}
              whileTap={isFull ? undefined : { scale: 0.94 }}
              className={`
                relative flex flex-col items-center gap-1.5 p-2 rounded-2xl
                border-2 transition-all duration-150 focus:outline-none
                focus-visible:ring-2 focus-visible:ring-amber-400
                ${isSelected
                  ? 'border-amber-400 bg-amber-50 shadow-soft'
                  : isFull
                    ? 'border-border/30 bg-card-bg/40 opacity-40 cursor-not-allowed'
                    : 'border-border/40 bg-card-bg hover:border-amber-300 hover:bg-warm-yellow/20'}
              `}
              aria-label={`${isSelected ? 'Remove' : 'Add'} ${flower.name}`}
              title={flower.meaning}
            >
              <FlowerSVG id={flower.id} size={36} />

              <span className="font-display text-[7px] tracking-[0.1em] uppercase text-warm-brown/70 leading-tight text-center">
                {flower.name}
              </span>

              {/* Selected check badge */}
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.3 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-soft"
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Meaning of selected flowers */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-warm-yellow/20 rounded-2xl px-4 py-3 space-y-1">
              <p className="font-display text-[8px] tracking-[0.25em] uppercase text-amber-600/70 mb-2">
                what your bouquet says
              </p>
              {selected.map((id) => {
                const f = FLOWERS.find((fl) => fl.id === id)
                if (!f) return null
                return (
                  <p key={id} className="font-body text-xs text-light-brown/80 leading-relaxed flex items-baseline gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0 translate-y-[1px]"
                      style={{ background: f.colors.primary }}
                    />
                    <span>
                      <span className="font-semibold text-warm-brown">{f.name}</span>
                      {': '}
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
