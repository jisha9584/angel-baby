'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSong } from '@/app/actions'

export default function SongForm() {
  const [open,   setOpen]   = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error,  setError]  = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await createSong(fd)
    if (result.success) {
      setStatus('sent')
      formRef.current?.reset()
      setTimeout(() => { setStatus('idle'); setOpen(false) }, 3000)
    } else {
      setStatus('error')
      setError(result.error ?? 'Something went wrong.')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <motion.button
          key="trigger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(true)}
          className="group font-display text-[9px] tracking-[0.35em] uppercase text-warm-brown/40 hover:text-warm-brown/65 transition-colors duration-300"
        >
          add a song
          <span className="ml-2 inline-block opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            →
          </span>
        </motion.button>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="border-t border-warm-brown/12 pt-8">
            <p className="font-display text-[8px] tracking-[0.4em] uppercase text-warm-brown/40 mb-6">
              a song that makes you think of him
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <input
                  name="title"
                  required
                  maxLength={120}
                  placeholder="song title"
                  className="flex-1 bg-transparent border-b border-warm-brown/15 focus:border-warm-brown/40 outline-none font-body text-sm text-warm-brown/80 placeholder:text-light-brown/30 pb-2 transition-colors"
                />
                <input
                  name="artist"
                  required
                  maxLength={120}
                  placeholder="artist"
                  className="flex-1 bg-transparent border-b border-warm-brown/15 focus:border-warm-brown/40 outline-none font-body text-sm text-warm-brown/80 placeholder:text-light-brown/30 pb-2 transition-colors"
                />
              </div>

              <textarea
                name="note"
                maxLength={300}
                placeholder="why this song? (optional)"
                rows={2}
                className="bg-transparent border-b border-warm-brown/15 focus:border-warm-brown/40 outline-none font-body text-sm text-warm-brown/75 placeholder:text-light-brown/30 pb-2 resize-none leading-relaxed transition-colors"
              />

              <input
                name="submitted_by"
                maxLength={80}
                placeholder="your name (optional)"
                className="bg-transparent border-b border-warm-brown/15 focus:border-warm-brown/40 outline-none font-body text-sm text-warm-brown/75 placeholder:text-light-brown/30 pb-2 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-display text-[8px] tracking-[0.3em] uppercase text-light-brown/30 hover:text-light-brown/55 transition-colors"
              >
                cancel
              </button>

              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-handwriting text-lg text-amber-600/65">
                    added ♡
                  </motion.span>
                ) : (
                  <motion.button
                    key="submit"
                    type="submit"
                    disabled={status === 'sending'}
                    className="font-display text-[8px] tracking-[0.3em] uppercase text-warm-brown/45 hover:text-warm-brown/75 disabled:opacity-30 transition-colors"
                  >
                    {status === 'sending' ? 'adding…' : 'add to the list'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {status === 'error' && (
              <p className="font-body text-xs text-red-400/50 mt-3">{error}</p>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
