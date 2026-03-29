import MemoryForm from '@/components/MemoryForm'
import { memorialConfig } from '@/config/memorial'

export const metadata = {
  title: `share a memory · ${memorialConfig.fullName}`,
}

export default function AddMemoryPage() {
  return (
    <div className="min-h-screen">

      <section className="px-4 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <p className="font-display text-[9px] tracking-[0.45em] uppercase text-amber-500/80 mb-4">
            add a memory
          </p>
          <h1 className="font-handwriting text-5xl sm:text-6xl text-warm-brown mb-3">
            something beautiful
          </h1>
          <p className="font-body text-sm text-light-brown max-w-sm mx-auto leading-relaxed">
            a story, a photo, a voice message. anything that captures a piece of{' '}
            {memorialConfig.firstName}. no account needed.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-24">
        <MemoryForm />
      </section>
    </div>
  )
}
