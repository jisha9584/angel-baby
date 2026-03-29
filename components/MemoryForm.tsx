'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Eye, Send, CheckCircle2, Heart, Video, Mic } from 'lucide-react'
import { Button }          from '@/components/ui/button'
import { Input }           from '@/components/ui/input'
import { Label }           from '@/components/ui/label'
import { Textarea }        from '@/components/ui/textarea'
import VoiceRecorder       from '@/components/VoiceRecorder'
import FlowerPicker        from '@/components/FlowerPicker'
import BouquetDisplay      from '@/components/BouquetDisplay'
import { createMemory }    from '@/app/actions'
import { memorialConfig }  from '@/config/memorial'

type Step     = 'form' | 'preview' | 'success'
type MediaTab = 'photo' | 'voice' | 'video'

export default function MemoryForm() {
  const [step, setStep]         = useState<Step>('form')
  const [name, setName]         = useState('')
  const [message, setMessage]   = useState('')
  const [mediaTab, setMediaTab] = useState<MediaTab>('photo')
  const [bouquet, setBouquet]   = useState<string[]>([])

  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [voiceBlob,    setVoiceBlob]    = useState<Blob | null>(null)
  const [videoFile,    setVideoFile]    = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const [error, setError]                = useState<string | null>(null)
  const [isPending, startTransition]     = useTransition()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }
  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null); setImagePreview(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { setError('Video must be under 50 MB.'); return }
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setError(null)
  }
  function clearVideo() {
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    setVideoFile(null); setVideoPreview(null)
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  function goToPreview(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim())    { setError('Please add your name.');   return }
    if (!message.trim()) { setError('Please write something.'); return }
    if (message.length > 2000) { setError('Message is too long.'); return }
    setStep('preview')
  }

  function submit() {
    const fd = new FormData()
    fd.append('name',    name.trim())
    fd.append('message', message.trim())
    fd.append('bouquet', JSON.stringify(bouquet))
    if (imageFile) fd.append('image', imageFile)
    if (voiceBlob) fd.append('voice', voiceBlob, 'voice-message.webm')
    if (videoFile) fd.append('video', videoFile)

    startTransition(async () => {
      const result = await createMemory(fd)
      if (result.success) {
        setStep('success')
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        if (videoPreview) URL.revokeObjectURL(videoPreview)
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
        setStep('form')
      }
    })
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, type: 'spring', bounce: 0.3 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', bounce: 0.5 }}
          className="flex justify-center mb-6"
        >
          {bouquet.length > 0
            ? <BouquetDisplay flowerIds={bouquet} size="md" />
            : <CheckCircle2 className="h-14 w-14 text-mint-green" strokeWidth={1.5} />
          }
        </motion.div>
        <h2 className="font-handwriting text-4xl text-warm-brown mb-3">
          Thank you, {name}
        </h2>
        <p className="font-body text-sm text-light-brown max-w-sm mx-auto leading-relaxed mb-10">
          {bouquet.length > 0
            ? `Your bouquet and memory have been sent to ${memorialConfig.firstName}.`
            : `Your memory has been added to the garden.`
          }{' '}
          His light grows a little brighter every time someone shares something beautiful.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { window.location.href = '/memories' }}>
            See the Memory Wall
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setName(''); setMessage(''); setBouquet([])
              clearImage(); clearVideo(); setVoiceBlob(null); setStep('form')
            }}
          >
            Share another memory
          </Button>
        </div>
      </motion.div>
    )
  }

  // ── Preview ────────────────────────────────────────────────────────────────
  if (step === 'preview') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-sm mx-auto"
      >
        <p className="text-center font-display text-[9px] tracking-[0.45em] uppercase text-light-brown/60 mb-6">
          preview
        </p>

        {/* Card + bouquet side by side — exactly how it will look on the wall */}
        <div className="flex items-start gap-3 mb-8">
          <div className="flex-1 bg-card-bg rounded-2xl shadow-polaroid overflow-hidden rotate-1">
            {videoPreview && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={videoPreview} className="w-full aspect-video object-cover" controls />
            )}
            {!videoPreview && imagePreview && (
              <div className="relative w-full aspect-[4/3]">
                <Image src={imagePreview} alt="Your photo" fill className="object-cover" />
              </div>
            )}
            {!videoPreview && !imagePreview && (
              <div className="h-2 bg-gradient-to-r from-warm-yellow/60 via-soft-blue/40 to-mint-green/50" />
            )}
            <div className="p-4">
              {voiceBlob && (
                <div className="mb-2 flex items-center gap-1.5 text-xs text-amber-500 font-body">
                  <Mic className="h-3 w-3" />
                  voice message included
                </div>
              )}
              <p className="font-body text-sm text-warm-brown/90 leading-relaxed line-clamp-4 mb-3">
                {message}
              </p>
              <div className="flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-blush fill-blush" />
                <span className="font-handwriting text-base text-light-brown">{name}</span>
              </div>
            </div>
          </div>

          {/* Bouquet alongside */}
          {bouquet.length > 0 && (
            <div className="flex-shrink-0 -rotate-2">
              <BouquetDisplay flowerIds={bouquet} size="sm" animate={false} />
            </div>
          )}
        </div>

        {error && <p className="text-center text-sm text-red-400 font-body mb-4">{error}</p>}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1"
            onClick={() => { setStep('form'); setError(null) }} disabled={isPending}>
            Edit
          </Button>
          <Button className="flex-1 gap-2" onClick={submit} disabled={isPending}>
            {isPending
              ? <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>Sharing...</motion.span>
              : <><Send className="h-4 w-4" /> Share this memory</>
            }
          </Button>
        </div>
      </motion.div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={goToPreview}
      className="space-y-7"
      noValidate
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          placeholder="e.g. Sarah, or the whole friend group"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Your memory{' '}
          <span className="text-light-brown/50 font-normal">a story, a moment, a feeling</span>
        </Label>
        <Textarea
          id="message"
          placeholder={`Add something beautiful about ${memorialConfig.firstName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          className="min-h-[150px]"
        />
        <p className="text-right text-xs text-light-brown/40 font-body">{message.length} / 2000</p>
      </div>

      {/* Bouquet builder */}
      <div className="space-y-3">
        <div>
          <Label>
            Send him a bouquet{' '}
            <span className="text-light-brown/50 font-normal">(optional)</span>
          </Label>
          <p className="text-xs text-light-brown/50 font-body mt-0.5">
            pick flowers to send alongside your memory. his favourite colour was purple.
          </p>
        </div>
        <FlowerPicker selected={bouquet} onChange={setBouquet} />
      </div>

      {/* Media */}
      <div className="space-y-3">
        <Label>
          Add media{' '}
          <span className="text-light-brown/50 font-normal">(optional)</span>
        </Label>

        <div className="flex rounded-2xl bg-muted/50 p-1 gap-1">
          {([
            { key: 'photo', label: 'Photo', Icon: Upload },
            { key: 'voice', label: 'Voice', Icon: Mic    },
            { key: 'video', label: 'Video', Icon: Video  },
          ] as { key: MediaTab; label: string; Icon: React.ElementType }[]).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMediaTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-display text-[9px] tracking-[0.1em] uppercase transition-all duration-150 ${
                mediaTab === key
                  ? 'bg-card-bg shadow-card text-warm-brown'
                  : 'text-light-brown/60 hover:text-warm-brown'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mediaTab === 'photo' && (
            <motion.div key="photo" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-warm-yellow/10">
                  <Image src={imagePreview} alt="Selected photo" fill className="object-cover" />
                  <button type="button" onClick={clearImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-warm-brown/50 text-white flex items-center justify-center hover:bg-warm-brown transition-colors"
                    aria-label="Remove photo">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => imageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border hover:border-amber-400 rounded-2xl py-10 flex flex-col items-center gap-3 text-light-brown hover:text-amber-500 transition-all duration-200 bg-card-bg hover:bg-warm-yellow/10">
                  <Upload className="h-7 w-7 opacity-50" />
                  <p className="font-display text-[9px] tracking-[0.2em] uppercase">choose a photo</p>
                  <p className="text-xs opacity-50 font-body">PNG, JPG, WEBP · max 5 MB</p>
                </button>
              )}
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </motion.div>
          )}

          {mediaTab === 'voice' && (
            <motion.div key="voice" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <VoiceRecorder onChange={setVoiceBlob} />
            </motion.div>
          )}

          {mediaTab === 'video' && (
            <motion.div key="video" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {videoPreview ? (
                <div className="relative rounded-2xl overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video src={videoPreview} controls className="w-full rounded-2xl" />
                  <button type="button" onClick={clearVideo}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-warm-brown/50 text-white flex items-center justify-center hover:bg-warm-brown transition-colors"
                    aria-label="Remove video">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => videoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border hover:border-amber-400 rounded-2xl py-10 flex flex-col items-center gap-3 text-light-brown hover:text-amber-500 transition-all duration-200 bg-card-bg hover:bg-warm-yellow/10">
                  <Video className="h-7 w-7 opacity-50" />
                  <p className="font-display text-[9px] tracking-[0.2em] uppercase">choose a video</p>
                  <p className="text-xs opacity-50 font-body">MP4, MOV, WEBM · max 50 MB</p>
                </button>
              )}
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-sm text-red-400 font-body text-center">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <Button type="submit" className="w-full h-12 text-base gap-2">
        <Eye className="h-4 w-4" />
        Preview memory
      </Button>
    </motion.form>
  )
}
