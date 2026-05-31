'use client'

import { motion } from 'framer-motion'
import type { Letter } from '@/types'
import BouquetDisplay from '@/components/BouquetDisplay'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function LetterCard({ letter, index }: { letter: Letter; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: 'easeOut' }}
      className="py-14 border-t border-warm-brown/10"
    >
      <p className="font-handwriting text-xl text-warm-brown/45 mb-6">Dear Rudraksh,</p>

      {letter.message?.trim() && (
        <p className="font-body text-sm text-warm-brown/65 leading-[1.9] whitespace-pre-wrap mb-10 max-w-prose">
          {letter.message}
        </p>
      )}

      {letter.bouquet && letter.bouquet.length > 0 && (
        <div className="mb-10 -ml-1">
          <BouquetDisplay flowerIds={letter.bouquet} size="sm" animate={false} />
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <p className="font-handwriting text-lg text-warm-brown/55">
          with love, {letter.name?.trim() || 'someone who will always love him'}
        </p>
        <p className="font-display text-[7px] tracking-[0.28em] uppercase text-light-brown/30">
          {formatDate(letter.created_at)}
        </p>
      </div>
    </motion.article>
  )
}
