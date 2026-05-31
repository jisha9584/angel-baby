'use client'

import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingWord {
  id:     string
  text:   string
  x:      number
  delay:  number
  rotate: number
}

type Phase = 'compose' | 'releasing' | 'gone'

export default function WhisperField() {
  const uid     = useId()
  const [message, setMessage] = useState('')
  const [phase,   setPhase]   = useState<Phase>('compose')
  const [words,   setWords]   = useState<FloatingWord[]>([])

  const MAX = 400

  function handleRelease() {
    if (!message.trim() || phase !== 'compose') return

    const floaters: FloatingWord[] = message.trim().split(/\s+/).map((w, i) => ({
      id:     `${uid}-${i}`,
      text:   w,
      x:      (Math.random() - 0.5) * 260,
      delay:  i * 0.07,
      rotate: (Math.random() - 0.5) * 22,
    }))
    setWords(floaters)
    setPhase('releasing')

    const totalDuration = floaters.length * 70 + 1800
    setTimeout(() => {
      setPhase('gone')
      setTimeout(() => {
        setWords([])
        setMessage('')
        setPhase('compose')
      }, 2000)
    }, totalDuration)
  }

  return (
    <div className="relative flex flex-col items-center gap-8">

      {/* Floating words */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden" style={{ zIndex: 60 }}>
        <AnimatePresence>
          {phase === 'releasing' && words.map((w) => (
            <motion.span
              key={w.id}
              initial={{ opacity: 0, y: 0, x: w.x * 0.2, rotate: 0 }}
              animate={{ opacity: [0, 0.7, 0.5, 0], y: -380, x: w.x, rotate: w.rotate }}
              transition={{ duration: 2.4, delay: w.delay, ease: [0.2, 0.0, 0.4, 1] }}
              className="absolute font-handwriting text-xl text-purple-200/60 select-none whitespace-nowrap"
              style={{ textShadow: '0 0 24px rgba(147,51,234,0.4)' }}
            >
              {w.text}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Sent confirmation */}
      <AnimatePresence>
        {phase === 'gone' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="font-handwriting text-4xl text-purple-200/50 mb-3">he heard you.</p>
            <p className="font-display text-[8px] tracking-[0.4em] uppercase text-purple-400/30">
              returning in a moment
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compose */}
      <AnimatePresence>
        {(phase === 'compose' || phase === 'releasing') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'releasing' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg flex flex-col gap-6"
          >
            <p className="font-display text-[8px] tracking-[0.5em] uppercase text-purple-300/30 text-center">
              dear rudraksh
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRelease() }}
              placeholder="say the thing you never got to say…"
              rows={7}
              className="w-full bg-transparent border-none outline-none resize-none font-body text-sm text-purple-100/65 placeholder:text-purple-400/22 leading-[1.9] text-center"
            />

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleRelease}
                disabled={!message.trim()}
                className="group font-display text-[9px] tracking-[0.35em] uppercase text-purple-300/35 hover:text-purple-300/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-300"
              >
                let it go
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="ml-2 inline-block"
                >
                  ↑
                </motion.span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
