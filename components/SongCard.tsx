'use client'

import { motion } from 'framer-motion'
import type { Song } from '@/types'

export default function SongCard({ song, index }: { song: Song; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: 'easeOut' }}
      className="py-6 border-t border-warm-brown/8 last:border-b flex items-start gap-6"
    >
      {/* Track number */}
      <span className="font-display text-[8px] tracking-widest text-warm-brown/25 pt-0.5 w-6 shrink-0 text-right">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-warm-brown/75 mb-0.5 truncate">
          {song.title}
        </p>
        <p className="font-display text-[8px] tracking-[0.2em] uppercase text-light-brown/50 truncate">
          {song.artist}
        </p>
        {song.note && (
          <p className="font-body text-xs text-light-brown/45 mt-3 italic leading-relaxed">
            &ldquo;{song.note}&rdquo;
          </p>
        )}
      </div>

      {song.submitted_by && (
        <p className="font-display text-[7px] tracking-[0.2em] uppercase text-light-brown/35 shrink-0 pt-0.5">
          {song.submitted_by}
        </p>
      )}
    </motion.div>
  )
}
