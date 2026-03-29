import Timeline from '@/components/Timeline'
import { memorialConfig } from '@/config/memorial'

export const metadata = {
  title: `a life in moments · ${memorialConfig.fullName}`,
}

export default function TimelinePage() {
  const { firstName, age } = memorialConfig

  return (
    <div className="min-h-screen">

      <section className="px-4 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <p className="font-display text-[9px] tracking-[0.45em] uppercase text-amber-500/80 mb-4">
            his story
          </p>
          <h1 className="font-handwriting text-5xl sm:text-6xl text-warm-brown mb-3">
            a life in moments
          </h1>
          <p className="font-body text-sm text-light-brown max-w-sm mx-auto leading-relaxed">
            {age} years of laughter, growth, and love.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <Timeline />
      </section>

      <section className="max-w-sm mx-auto px-4 pb-20 text-center">
        <div className="h-px w-16 bg-warm-yellow/80 mx-auto mb-8" />
        <p className="font-handwriting text-3xl text-warm-brown leading-snug mb-3">
          &ldquo;The ones who love us never really leave us.&rdquo;
        </p>
        <p className="font-display text-[9px] tracking-[0.25em] uppercase text-light-brown/50">
          forever {age}. forever {firstName}.
        </p>
      </section>
    </div>
  )
}
