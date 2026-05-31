import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import TributeMode from '@/components/TributeMode'
import AmbientBackground from '@/components/AmbientBackground'
import ThemeBanner from '@/components/ThemeBanner'
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
          background: 'linear-gradient(160deg, #F7F1E5 0%, #F6EEDF 35%, #EEF5FC 65%, #F0FBF0 100%)',
        }}
      >
        {/* Layer 0 — living ambient background */}
        <AmbientBackground />

        {/* Layer 1 — 49-day tribute overlay (day 49 only) */}
        <TributeMode />

        {/* Layer 2 — special day banner (13th of month / birthday) */}
        <ThemeBanner />

        {/* Layer 3 — navigation */}
        <Navigation />

        {/* Layer 3 — page content, sits above the canvas */}
        <main className="relative" style={{ zIndex: 10 }}>
          {children}
        </main>
      </body>
    </html>
  )
}
