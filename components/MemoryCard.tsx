'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Mic, Video } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import AudioPlayer from '@/components/AudioPlayer'
import BouquetDisplay from '@/components/BouquetDisplay'
import { stableRotation, relativeDate } from '@/lib/utils'
import type { Memory } from '@/types'

interface Props { memory: Memory; index?: number }

export default function MemoryCard({ memory, index = 0 }: Props) {
  const [open, setOpen] = useState(false)
  const rotation = stableRotation(memory.id)

  const hasBouquet = memory.bouquet && memory.bouquet.length > 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.5), ease: 'easeOut' }}
        className="flex items-start gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.025, rotate: rotation * 0.25, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          style={{ transform: `rotate(${rotation}deg)` }}
          className="flex-1 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl"
          aria-label={`Memory from ${memory.name}`}
        >
        <div className="bg-card-bg rounded-2xl shadow-polaroid overflow-hidden transition-shadow duration-300 group-hover:shadow-hover">

          {memory.video_url && (
            <div className="relative w-full aspect-video bg-warm-brown/5 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={memory.video_url} className="w-full h-full object-cover" muted playsInline />
              <div className="absolute inset-0 flex items-center justify-center bg-warm-brown/20">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                  <Video className="h-5 w-5 text-warm-brown/70" />
                </div>
              </div>
            </div>
          )}

          {!memory.video_url && memory.image_url && (
            <div className="relative w-full aspect-[4/3] bg-warm-yellow/10 overflow-hidden">
              <Image
                src={memory.image_url}
                alt={`Photo from ${memory.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}

          {!memory.video_url && !memory.image_url && (
            <div className="h-1.5 bg-gradient-to-r from-warm-yellow/50 via-soft-blue/30 to-mint-green/40" />
          )}

          <div className="p-4 pt-3">
            {memory.voice_url && (
              <div className="flex items-center gap-1 mb-2">
                <Mic className="h-3 w-3 text-amber-400" />
                <span className="font-display text-[8px] tracking-[0.15em] uppercase text-amber-500">voice message</span>
              </div>
            )}

            <p className="font-body text-sm text-warm-brown/85 leading-relaxed line-clamp-4 mb-3">
              {memory.message}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Heart className="h-3 w-3 text-blush fill-blush flex-shrink-0" aria-hidden="true" />
                <span className="font-handwriting text-base text-light-brown truncate">{memory.name}</span>
              </div>
              <span className="font-display text-[8px] tracking-[0.15em] uppercase text-light-brown/40 flex-shrink-0">
                {relativeDate(memory.created_at)}
              </span>
            </div>
          </div>
        </div>
        </motion.button>

        {hasBouquet && (
          <div className="-rotate-3 flex-shrink-0 self-end mb-2">
            <BouquetDisplay flowerIds={memory.bouquet!} size="sm" animate={false} />
          </div>
        )}
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {memory.video_url && (
            <div className="rounded-t-3xl overflow-hidden bg-black/5">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={memory.video_url} controls className="w-full" />
            </div>
          )}

          {!memory.video_url && memory.image_url && (
            <div className="relative w-full aspect-video rounded-t-3xl overflow-hidden bg-warm-yellow/10">
              <Image
                src={memory.image_url}
                alt={`Photo from ${memory.name}`}
                fill
                className="object-cover"
                sizes="576px"
              />
            </div>
          )}

          <div className="px-6 pt-4 pb-6 space-y-4">
            <DialogHeader>
              {!memory.video_url && !memory.image_url && (
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-amber-300 to-soft-blue mb-2" />
              )}
              <DialogTitle className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-blush fill-blush" aria-hidden="true" />
                {memory.name}
              </DialogTitle>
            </DialogHeader>

            {memory.voice_url && <AudioPlayer url={memory.voice_url} compact />}

            <p className="font-body text-[15px] text-warm-brown/90 leading-relaxed whitespace-pre-wrap">
              {memory.message}
            </p>

            {hasBouquet && (
              <div className="flex flex-col items-center gap-2 py-2">
                <BouquetDisplay flowerIds={memory.bouquet!} size="md" />
                <p className="font-display text-[8px] tracking-[0.2em] uppercase text-amber-500/70">
                  bouquet for rudraksh
                </p>
              </div>
            )}

            <p className="font-display text-[8px] tracking-[0.15em] uppercase text-light-brown/40 pt-1">
              {new Date(memory.created_at).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
