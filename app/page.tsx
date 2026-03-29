import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowRight } from 'lucide-react'
import FloatingElements from '@/components/FloatingElements'
import { memorialConfig } from '@/config/memorial'

export default function LandingPage() {
  const { firstName, fullName, tributeLine, description, heroImage } = memorialConfig

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col">

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElements />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 48%, rgba(249,228,183,0.45) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto gap-6">

          {/* Portrait */}
          {heroImage ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-hover border-4 border-white ring-4 ring-warm-yellow/40">
              <Image src={heroImage} alt={fullName} fill className="object-cover" priority />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-warm-yellow via-amber-100 to-soft-blue shadow-hover border-4 border-white ring-4 ring-warm-yellow/30 flex items-center justify-center">
              <span className="font-handwriting text-5xl text-warm-brown/60">
                {firstName.charAt(0)}
              </span>
            </div>
          )}

          {/* Label */}
          <p className="font-display text-[9px] tracking-[0.45em] uppercase text-amber-500/80 -mb-2">
            in loving memory
          </p>

          {/* Name */}
          <div>
            <h1 className="font-handwriting text-5xl sm:text-6xl text-warm-brown leading-none pb-2">
              {fullName}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-12 bg-warm-yellow/80" />
              <Heart className="h-3.5 w-3.5 text-blush fill-blush" aria-hidden="true" />
              <div className="h-px w-12 bg-warm-yellow/80" />
            </div>
          </div>

          {/* Tribute line */}
          <p className="font-body text-base text-light-brown leading-relaxed max-w-sm italic">
            {tributeLine}
          </p>

          {/* Description */}
          <p className="font-body text-sm text-light-brown/70 leading-relaxed max-w-sm hidden sm:block -mt-1">
            {description}
          </p>

          {/* Primary CTA */}
          <Link
            href="/memories"
            className="group mt-1 inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-500 text-white font-display text-[10px] tracking-[0.2em] uppercase px-8 py-3.5 rounded-full shadow-soft hover:shadow-hover transition-all duration-200 active:scale-95"
          >
            enter the garden
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Link>

          <Link
            href="/add-memory"
            className="font-display text-[9px] tracking-[0.25em] uppercase text-light-brown/50 hover:text-amber-500 transition-colors -mt-2"
          >
            share a memory
          </Link>
        </div>
      </section>

      {/* What is this space */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <p className="font-display text-[9px] tracking-[0.45em] uppercase text-amber-500/70 mb-3">
            this space
          </p>
          <h2 className="font-handwriting text-4xl text-warm-brown mb-3">
            a living space of love
          </h2>
          <p className="font-body text-sm text-light-brown max-w-sm mx-auto leading-relaxed">
            a place where everyone who loved {firstName} can come together.
            share a story, leave a photo, say the thing you never got to say.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { accent: 'bg-warm-yellow',   title: 'Photos',        body: 'upload moments you shared together.' },
            { accent: 'bg-soft-blue',     title: 'Memories',      body: 'a story, a laugh, a small detail only you remember.' },
            { accent: 'bg-mint-green',    title: 'Voice + Video',  body: 'leave a message in your own voice, or a video memory.' },
            { accent: 'bg-violet-200',    title: 'Quick Words',    body: 'three words. one feeling. who was he to you?' },
          ].map((card, i) => (
            <div key={i} className="bg-card-bg/80 rounded-2xl px-5 py-7 shadow-card text-center">
              <div className={`mx-auto mb-4 w-8 h-1 rounded-full ${card.accent}`} />
              <p className="font-display text-[10px] tracking-[0.2em] uppercase text-warm-brown mb-2">{card.title}</p>
              <p className="font-body text-xs text-light-brown leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
