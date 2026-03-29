'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, RotateCcw, X } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import { formatDuration } from '@/lib/utils'

type RecordState = 'idle' | 'recording' | 'recorded'

interface Props {
  onChange: (blob: Blob | null) => void
}

const BAR_DELAYS = [0, 0.15, 0.05, 0.2, 0.1, 0.25, 0.08]

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-6" aria-hidden="true">
      {BAR_DELAYS.map((delay, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-amber-400"
          animate={active
            ? { scaleY: [0.3, 1, 0.5, 0.9, 0.3], opacity: 1 }
            : { scaleY: 0.3, opacity: 0.4 }
          }
          transition={active
            ? { duration: 0.7, delay, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
          }
          style={{ height: '100%', transformOrigin: 'center' }}
        />
      ))}
    </div>
  )
}

const MAX_SECS = 120

export default function VoiceRecorder({ onChange }: Props) {
  const [state,    setState]    = useState<RecordState>('idle')
  const [seconds,  setSeconds]  = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef   = useRef<Blob[]>([])
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clean up timer + object URL on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioURL) URL.revokeObjectURL(audioURL)
      recorderRef.current?.stream?.getTracks().forEach((t) => t.stop())
    }
    // audioURL intentionally omitted: we only want this on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startRecording() {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (timerRef.current) clearInterval(timerRef.current)
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url  = URL.createObjectURL(blob)
        setAudioURL(url)
        onChange(blob)
        setState('recorded')
      }

      chunksRef.current = []
      recorder.start()
      recorderRef.current = recorder
      setState('recording')
      setSeconds(0)

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECS) { recorder.stop(); return s }
          return s + 1
        })
      }, 1000)
    } catch {
      alert('Microphone access is needed to record a voice message.')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
  }

  function clearRecording() {
    if (audioURL) URL.revokeObjectURL(audioURL)
    setAudioURL(null)
    onChange(null)
    setState('idle')
    setSeconds(0)
    chunksRef.current = []
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card-bg p-4">
      <AnimatePresence mode="wait" initial={false}>

        {state === 'idle' && (
          <motion.button
            key="idle"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={startRecording}
            className="w-full flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-warm-yellow/50 group-hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <Mic className="h-4 w-4 text-warm-brown/70" />
            </div>
            <div>
              <p className="text-sm font-semibold text-warm-brown/80 font-body">
                Record a voice message
              </p>
              <p className="text-xs text-light-brown/55 font-body mt-0.5">
                tap to start. up to 2 minutes.
              </p>
            </div>
          </motion.button>
        )}

        {state === 'recording' && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"
              aria-label="Recording"
            />
            <WaveformBars active />
            <span className="font-display text-[9px] tabular-nums text-warm-brown/70 ml-1">
              {formatDuration(seconds)}
            </span>
            <button
              type="button"
              onClick={stopRecording}
              className="ml-auto w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 transition-colors flex-shrink-0"
              aria-label="Stop recording"
            >
              <Square className="h-3.5 w-3.5 fill-red-400" />
            </button>
          </motion.div>
        )}

        {state === 'recorded' && audioURL && (
          <motion.div
            key="recorded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <AudioPlayer url={audioURL} />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={clearRecording}
                className="flex items-center gap-1.5 text-xs text-light-brown/60 hover:text-warm-brown transition-colors font-body"
              >
                <RotateCcw className="h-3 w-3" />
                Re-record
              </button>
              <button
                type="button"
                onClick={clearRecording}
                className="ml-auto flex items-center gap-1 text-xs text-light-brown/50 hover:text-red-400 transition-colors font-body"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
