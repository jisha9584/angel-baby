import StarField from '@/components/StarField'
import WhisperField from '@/components/WhisperField'

export const metadata = {
  title: 'Whisper · Angel Baby',
  description: 'Say the thing you never got to say. Nothing is saved. Just between you and him.',
}

export default function WhisperPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden hero-sky">

      {/* Stars */}
      <StarField count={120} />

      {/* Soft aurora behind the form */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(88,28,135,0.15) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Page heading */}
      <div className="relative z-10 text-center mb-14">
        <p className="font-display text-[8px] tracking-[0.55em] uppercase text-purple-400/40 mb-4">
          whisper
        </p>
        <h1 className="font-handwriting text-5xl md:text-6xl text-white/80 mb-4">
          just between you and him
        </h1>
        <p className="font-body text-sm text-purple-200/40 max-w-xs mx-auto leading-relaxed">
          your words drift up and away. nothing is stored.
        </p>
      </div>

      {/* The whisper field */}
      <div className="relative z-10 w-full max-w-lg">
        <WhisperField />
      </div>

      {/* Ambient bottom glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(88,28,135,0.12) 0%, transparent 100%)',
        }}
      />
    </section>
  )
}
