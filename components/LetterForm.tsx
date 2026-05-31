'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createLetter } from '@/app/actions'
import FlowerPicker from '@/components/FlowerPicker'

export default function LetterForm() {
  const [open,    setOpen]    = useState(false)
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error,   setError]   = useState('')
  const [bouquet, setBouquet] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await createLetter(fd)
    if (result.success) {
      setStatus('sent')
      formRef.current?.reset()
      setBouquet([])
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
          transition={{ duration: 0.4 }}
          onClick={() => setOpen(true)}
          className="group font-display text-[9px] tracking-[0.35em] uppercase text-warm-brown/40 hover:text-warm-brown/65 transition-colors duration-300"
        >
          write him a letter
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
          <form ref={formRef} onSubmit={handleSubmit} className="border-t border-warm-brown/12 pt-10">
            <p className="font-handwriting text-xl text-warm-brown/50 mb-6">Dear Rudraksh,</p>

            <textarea
              name="message"
              placeholder="write whatever you need to say…"
              rows={9}
              maxLength={5000}
              className="w-full bg-transparent border-none outline-none resize-none font-body text-sm text-warm-brown/80 placeholder:text-light-brown/30 leading-[1.9]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 27px, rgba(124,92,63,0.055) 27px, rgba(124,92,63,0.055) 28px)',
              }}
            />

            {/* Hidden field — carries the chosen bouquet into the form submit */}
            <input type="hidden" name="bouquet" value={JSON.stringify(bouquet)} />

            {/* Bouquet — shown inline, gather flowers as you write */}
            <div className="mt-8 pt-6 border-t border-warm-brown/10 space-y-4">
              <p className="font-display text-[8px] tracking-[0.3em] uppercase text-warm-brown/40">
                flowers with your letter{' '}
                <span className="text-light-brown/40">(optional · his colour was purple)</span>
              </p>
              <FlowerPicker selected={bouquet} onChange={setBouquet} variant="letter" />
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-warm-brown/10">
              <div className="flex items-center gap-3">
                <span className="font-handwriting text-lg text-light-brown/45">with love,</span>
                <input
                  name="name"
                  placeholder="your name (optional)"
                  maxLength={80}
                  className="bg-transparent border-b border-warm-brown/15 outline-none font-handwriting text-lg text-warm-brown/80 placeholder:text-light-brown/30 pb-0.5 w-40"
                />
              </div>

              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="font-display text-[8px] tracking-[0.3em] uppercase text-light-brown/30 hover:text-light-brown/55 transition-colors"
                >
                  cancel
                </button>

                <AnimatePresence mode="wait">
                  {status === 'sent' ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-handwriting text-lg text-amber-600/65"
                    >
                      sent ♡
                    </motion.span>
                  ) : (
                    <motion.button
                      key="submit"
                      type="submit"
                      disabled={status === 'sending'}
                      className="font-display text-[8px] tracking-[0.3em] uppercase text-warm-brown/45 hover:text-warm-brown/75 disabled:opacity-30 transition-colors"
                    >
                      {status === 'sending' ? 'sending…' : 'seal & send'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {status === 'error' && (
              <p className="font-body text-xs text-red-400/60 mt-3">{error}</p>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
