import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Heart } from 'lucide-react'
import StarField from '@/components/StarField'
import DayCounter from '@/components/DayCounter'
import { memorialConfig } from '@/config/memorial'

export default function LandingPage() {
  const { fullName, tributeLine, heroImage } = memorialConfig

  return (
    <div className="paper-grain">
      {/* ══════════════════════ NIGHT SKY HERO ══════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden hero-sky">

        {/* Twinkling stars */}
        <StarField />

        {/* Purple aurora bloom centred behind photo */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(147,51,234,0.18) 0%, transparent 68%)',
            filter: 'blur(48px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-5 px-6 py-24">

          {/* Label */}
          <p className="font-display text-[8px] tracking-[0.55em] uppercase text-purple-300/50">
            in loving memory
          </p>

          {/* Moon photo */}
          <div className="relative my-3">
            {/* Outer soft halo */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 rounded-full pointer-events-none animate-soft-pulse"
              style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.13) 0%, transparent 68%)' }}
            />
            {/* Mid ring */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-full pointer-events-none animate-soft-pulse"
              style={{ background: 'rgba(147,51,234,0.09)', animationDelay: '0.85s' }}
            />
            {/* Portrait */}
            <div
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border border-white/10"
              style={{
                boxShadow:
                  '0 0 36px rgba(147,51,234,0.52), 0 0 70px rgba(88,28,135,0.30), 0 0 110px rgba(88,28,135,0.13)',
              }}
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={fullName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-950 to-indigo-950 flex items-center justify-center">
                  <span className="font-handwriting text-7xl text-purple-200/50">R</span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="font-handwriting text-5xl md:text-6xl lg:text-7xl text-white/92 leading-none tracking-wide">
            {fullName}
          </h1>

          {/* Tribute line */}
          <p className="font-body text-base text-purple-100/48 italic max-w-[19rem] leading-relaxed">
            {tributeLine}
          </p>

          {/* Days since he left — a quiet, sliding counter */}
          <div className="mt-4 mb-2">
            <DayCounter />
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 mt-3">
            <Link
              href="/memories"
              className="group inline-flex items-center gap-3 border border-purple-400/22 hover:border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/18 text-purple-100/78 hover:text-purple-100 font-display text-[9px] tracking-[0.26em] uppercase px-8 py-3.5 rounded-full transition-all duration-300"
            >
              enter the garden
              <span className="opacity-55 group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>

            <Link
              href="/add-memory"
              className="font-display text-[8px] tracking-[0.26em] uppercase text-purple-300/28 hover:text-purple-300/58 transition-colors duration-200"
            >
              share a memory
            </Link>
          </div>
        </div>

        {/* Soft fade melting the night sky into the garden below */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F7F1E5)' }}
        />

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce pointer-events-none"
        >
          <p className="font-display text-[6px] tracking-[0.45em] uppercase text-warm-brown/30">scroll</p>
          <ChevronDown className="h-4 w-4 text-warm-brown/30" />
        </div>
      </section>

      {/* ══════════════════════ GARDEN PORTAL ══════════════════════ */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center pt-20 mb-12">
            <p className="font-display text-[9px] tracking-[0.45em] uppercase text-amber-500/70 mb-3">
              the garden
            </p>
            <h2 className="font-handwriting text-4xl text-warm-brown mb-3">
              a living space of love
            </h2>
            <p className="font-body text-sm text-light-brown max-w-sm mx-auto leading-relaxed">
              a place where everyone who loved {memorialConfig.firstName} can come together.
              share a story, leave a photo, say the thing you never got to say.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {([
              { accent: 'bg-warm-yellow', title: 'Photos',        body: 'upload moments you shared together.' },
              { accent: 'bg-soft-blue',   title: 'Memories',      body: 'a story, a laugh, a small detail only you remember.' },
              { accent: 'bg-mint-green',  title: 'Voice + Video', body: 'leave a message in your own voice.' },
              { accent: 'bg-violet-200',  title: 'Quick Words',   body: 'three words. one feeling. who was he to you?' },
            ] as const).map((card, i) => (
              <div key={i} className="bg-card-bg/80 rounded-2xl px-5 py-7 shadow-card text-center">
                <div className={`mx-auto mb-4 w-8 h-1 rounded-full ${card.accent}`} />
                <p className="font-display text-[10px] tracking-[0.2em] uppercase text-warm-brown mb-2">
                  {card.title}
                </p>
                <p className="font-body text-xs text-light-brown leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/memories"
              className="group inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-500 text-white font-display text-[10px] tracking-[0.2em] uppercase px-8 py-3.5 rounded-full shadow-soft hover:shadow-hover transition-all duration-200 active:scale-95"
            >
              enter the garden
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link
              href="/add-memory"
              className="inline-flex items-center gap-2 border border-amber-200 text-amber-700/65 hover:text-amber-700 hover:border-amber-300 font-display text-[10px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-full transition-all duration-200"
            >
              share a memory
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ A LETTER FROM HIS SISTER ══════════════════════ */}
      <footer className="px-6 pb-24 text-center">

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-warm-yellow/50" />
          <Heart className="h-4 w-4 text-blush/60 fill-blush/40" aria-hidden="true" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-warm-yellow/50" />
        </div>

        {/* Love letter */}
        <div className="max-w-lg mx-auto mb-12">
          <p className="font-display text-[9px] tracking-[0.35em] uppercase text-amber-600/65 mb-6">
            from your sister, with love
          </p>

          <p className="font-handwriting text-[1.35rem] text-warm-brown/75 leading-[1.9] mb-5">
            I don&apos;t know how to say goodbye to someone who was never supposed to leave.
            So I won&apos;t.
          </p>

          <p className="font-body text-sm text-light-brown/65 leading-relaxed mb-5 max-w-sm mx-auto">
            You were eighteen years of the best kind of chaos. Loud and gentle and funny
            in a way that made even hard moments feel lighter.
            The person who made every room feel like it was already full
            before you even walked in.
            I am still learning how to take up space without you in it.
          </p>

          <p className="font-handwriting text-[1.35rem] text-warm-brown/75 leading-[1.9] mb-5">
            I carry you in the purple things. In the music too loud for headphones.
            In pani puri at midnight, in long drives going nowhere,
            in every moment that made me want to turn and tell you first.
          </p>

          <p className="font-body text-sm text-light-brown/65 leading-relaxed max-w-sm mx-auto">
            You were about to start everything. The brand, university, whatever came next.
            You were eighteen and already the most fully formed person I knew.
            This garden exists so that never gets forgotten.
            So that everyone who loved you has somewhere to come
            when missing you gets heavy.
            We keep it alive the same way you kept us alive.
            Just by being here.
          </p>
        </div>

        {/* Closing line */}
        <p className="font-handwriting text-3xl text-light-brown/70 mb-2">
          Always in our hearts
        </p>
        <p className="font-display text-[9px] tracking-[0.3em] uppercase text-light-brown/30">
          a living tribute, kept alive by love.
        </p>

      </footer>
    </div>
  )
}
