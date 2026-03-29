import type { Metadata } from 'next'
import './globals.css'
import { Heart } from 'lucide-react'
import Navigation from '@/components/Navigation'
import TributeMode from '@/components/TributeMode'
import AmbientBackground from '@/components/AmbientBackground'
import { memorialConfig } from '@/config/memorial'

export const metadata: Metadata = {
  title: `${memorialConfig.siteTitle} · ${memorialConfig.fullName}`,
  description: memorialConfig.tributeLine,
  // Open Graph — makes sharing on social media look beautiful
  openGraph: {
    title: `In Loving Memory of ${memorialConfig.fullName}`,
    description: memorialConfig.tributeLine,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        z-index layering (low → high):
          0  — AmbientBackground canvas (fixed, behind everything)
          1  — body background gradient (CSS)
          10 — page content (relative, scrolls normally)
          40 — Navigation (sticky)
          50 — Modals / TributeMode overlay
      */}
      <body className="relative min-h-screen font-body antialiased"
        style={{
          // Warm gradient that the particles glow through
          background: 'linear-gradient(160deg, #FEF7ED 0%, #FDF2E9 35%, #EEF5FC 65%, #F0FBF0 100%)',
        }}
      >
        {/* Layer 0 — living ambient background */}
        <AmbientBackground />

        {/* Layer 1 — 49-day tribute overlay (day 49 only) */}
        <TributeMode />

        {/* Layer 2 — navigation */}
        <Navigation />

        {/* Layer 3 — page content, sits above the canvas */}
        <main className="relative" style={{ zIndex: 10 }}>
          {children}
        </main>

        {/* Footer */}
        <footer className="relative mt-24 pb-16 px-6 text-center" style={{ zIndex: 10 }}>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-warm-yellow/50" />
            <Heart className="h-4 w-4 text-blush/60 fill-blush/40" aria-hidden="true" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-warm-yellow/50" />
          </div>

          {/* Love letter */}
          <div className="max-w-lg mx-auto mb-12">
            <p className="font-display text-[8px] tracking-[0.35em] uppercase text-amber-500/50 mb-6">
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
      </body>
    </html>
  )
}
