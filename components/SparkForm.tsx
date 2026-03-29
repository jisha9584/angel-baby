'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send } from 'lucide-react'
import { createSpark } from '@/app/actions'

export default function SparkForm() {
  const [open,       setOpen]       = useState(false)
  const [text,       setText]       = useState('')
  const [name,       setName]       = useState('')
  const [done,       setDone]       = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [isPending,  startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!text.trim()) { setError('Write something first.'); return }

    const fd = new FormData()
    fd.append('text', text.trim())
    if (name.trim()) fd.append('name', name.trim())

    startTransition(async () => {
      const result = await createSpark(fd)
      if (result.success) {
        setDone(true)
        setText('')
        setName('')
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    })
  }

  function reset() {
    setDone(false)
    setOpen(false)
    setError(null)
  }

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!open && !done && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 border border-dashed border-amber-300 hover:border-amber-400 bg-warm-yellow/10 hover:bg-warm-yellow/20 text-amber-600/80 hover:text-amber-700 font-display text-[9px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
          >
            <Sparkles className="h-3 w-3" />
            add a word or two about him
          </motion.button>
        )}

        {open && !done && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            onSubmit={submit}
            className="w-full max-w-sm bg-card-bg rounded-2xl shadow-card px-6 py-5 space-y-4"
          >
            <div>
              <p className="font-display text-[9px] tracking-[0.3em] uppercase text-amber-500/70 mb-1">
                in three words or three sentences
              </p>
              <p className="font-handwriting text-lg text-warm-brown/80 leading-tight">
                who was Rudraksh to you?
              </p>
            </div>

            <div className="space-y-1">
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={120}
                rows={3}
                placeholder="funny. kind. the loudest in the room."
                className="w-full resize-none rounded-xl border border-border bg-cream/60 px-3 py-2.5 font-body text-sm text-warm-brown placeholder:text-light-brown/30 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
              />
              <p className="text-right font-display text-[8px] tracking-widest text-light-brown/30">
                {text.length} / 120
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="your name (optional)"
              className="w-full rounded-xl border border-border bg-cream/60 px-3 py-2 font-body text-sm text-warm-brown placeholder:text-light-brown/30 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />

            {error && (
              <p className="text-xs text-red-400 font-body text-center">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={reset}
                disabled={isPending}
                className="flex-1 py-2 rounded-xl border border-border font-display text-[9px] tracking-[0.15em] uppercase text-light-brown/60 hover:text-warm-brown transition-colors"
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !text.trim()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-white font-display text-[9px] tracking-[0.15em] uppercase transition-all"
              >
                {isPending
                  ? <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>sending</motion.span>
                  : <><Send className="h-3 w-3" /> send</>
                }
              </button>
            </div>
          </motion.form>
        )}

        {done && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <p className="font-handwriting text-2xl text-warm-brown/80 mb-1">thank you.</p>
            <p className="font-body text-xs text-light-brown/60 mb-4">your words are part of his garden now.</p>
            <button
              onClick={reset}
              className="font-display text-[8px] tracking-[0.2em] uppercase text-amber-500/70 hover:text-amber-600 transition-colors"
            >
              add another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
