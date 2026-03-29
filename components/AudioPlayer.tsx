'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface Props {
  url: string
  compact?: boolean
}

export default function AudioPlayer({ url, compact = false }: Props) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const a = ref.current
    if (!a) return
    const onEnd  = () => { setPlaying(false); setProgress(0) }
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0)
    const onMeta = () => setDuration(a.duration || 0)
    a.addEventListener('ended',          onEnd)
    a.addEventListener('timeupdate',     onTime)
    a.addEventListener('loadedmetadata', onMeta)
    return () => {
      a.removeEventListener('ended',          onEnd)
      a.removeEventListener('timeupdate',     onTime)
      a.removeEventListener('loadedmetadata', onMeta)
    }
  }, [url])

  function toggle() {
    const a = ref.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else         { a.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  const btnSize  = compact ? 'w-8 h-8'   : 'w-9 h-9'
  const barSize  = compact ? 'h-1'        : 'h-1.5'
  const wrapper  = compact
    ? 'bg-warm-yellow/20 rounded-xl px-3 py-2.5'
    : 'rounded-xl px-3 py-2.5'

  return (
    <div className={`flex items-center gap-3 w-full ${wrapper}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={ref} src={url} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        className={`${btnSize} rounded-full bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center flex-shrink-0 transition-colors`}
        aria-label={playing ? 'Pause' : 'Play voice message'}
      >
        {playing
          ? <Pause className="h-3 w-3 fill-white" />
          : <Play  className="h-3 w-3 fill-white ml-0.5" />
        }
      </button>

      <div className={`flex-1 ${barSize} bg-warm-yellow/50 rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-amber-400 rounded-full transition-all duration-100`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <span className="font-display text-[8px] tracking-[0.1em] text-light-brown/50 tabular-nums w-8 text-right flex-shrink-0">
        {formatDuration(duration)}
      </span>
    </div>
  )
}
