'use client'

/**
 * AutoImage
 *
 * Shows a photo in its natural orientation. It measures the image's real
 * dimensions on load and sizes its frame to match, so portrait photos stay
 * tall and landscape stay wide. No cropped-off heads, no squished faces.
 *
 * The aspect ratio is gently clamped so an extreme panorama or a very tall
 * phone screenshot can't blow out the layout; within the normal range the
 * photo is shown exactly as taken.
 *
 * `fit="cover"`  — fills the frame (used on the memory wall, where the frame
 *                  already matches the photo's shape, so nothing is cropped).
 * `fit="contain"`— shows the whole photo, letterboxed if needed (used in the
 *                  full-size dialog so nothing is ever clipped).
 */

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  src: string
  alt: string
  sizes?: string
  className?: string      // extra classes on the frame
  imgClassName?: string   // extra classes on the image itself
  fit?: 'cover' | 'contain'
  bg?: string
  minRatio?: number       // widest-allowed portrait (w/h)
  maxRatio?: number       // widest-allowed landscape (w/h)
  maxHeight?: string      // optional cap, e.g. '70vh'
  priority?: boolean
}

export default function AutoImage({
  src,
  alt,
  sizes,
  className = '',
  imgClassName = '',
  fit = 'cover',
  bg = 'bg-warm-yellow/10',
  minRatio = 0.6,
  maxRatio = 1.78,
  maxHeight,
  priority,
}: Props) {
  const [ratio, setRatio] = useState<number | null>(null)

  // Local object URLs (upload previews) can't be optimized by next/image.
  const isLocal = src.startsWith('blob:') || src.startsWith('data:')

  // Until the image loads we assume a gentle 4:3; then snap to the real shape.
  const aspectRatio = ratio ? Math.min(Math.max(ratio, minRatio), maxRatio) : 4 / 3

  return (
    <div
      className={`relative w-full overflow-hidden ${bg} ${className}`}
      style={{ aspectRatio, maxHeight }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isLocal}
        className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${imgClassName}`}
        onLoad={(e) => {
          const t = e.currentTarget
          if (t.naturalWidth && t.naturalHeight) setRatio(t.naturalWidth / t.naturalHeight)
        }}
      />
    </div>
  )
}
