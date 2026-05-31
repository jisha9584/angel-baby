import { getLetters } from '@/app/actions'
import LetterCard from '@/components/LetterCard'
import LetterForm from '@/components/LetterForm'

export const metadata = {
  title: 'Letters · Angel Baby',
  description: 'Write a letter to Rudraksh. Words that needed to be said.',
}

export const revalidate = 60

export default async function LettersPage() {
  const letters = await getLetters()

  return (
    <div className="paper-grain min-h-screen relative">
      {/* Giant watermark — lives behind everything */}
      <div
        aria-hidden="true"
        className="fixed inset-0 flex items-start justify-start pointer-events-none overflow-hidden select-none"
        style={{ paddingTop: '18vh', paddingLeft: '4vw' }}
      >
        <span
          className="font-handwriting block"
          style={{
            fontSize: 'clamp(4rem, 15vw, 13rem)',
            color: 'rgba(124, 92, 63, 0.035)',
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
          }}
        >
          Dear<br />Rudraksh,
        </span>
      </div>

      <div className="relative max-w-[640px] mx-auto px-8 pt-28 pb-36">

        {/* Header */}
        <header className="mb-24">
          <p className="font-display text-[9px] tracking-[0.5em] uppercase text-amber-600/70 mb-10">
            letters to him
          </p>
          <h1 className="font-handwriting text-5xl text-warm-brown/70 mb-5">
            Dear Rudraksh,
          </h1>
          <p className="font-body text-sm text-light-brown/55 leading-relaxed">
            words you never got to say out loud. say them here. he&apos;s reading.
          </p>
        </header>

        {/* Compose trigger / form */}
        <div className="mb-24">
          <LetterForm />
        </div>

        {/* Letters — no containers, just prose */}
        {letters.length === 0 ? (
          <div className="pt-8 border-t border-warm-brown/10">
            <p className="font-handwriting text-3xl text-warm-brown/25">
              be the first to write
            </p>
          </div>
        ) : (
          <div>
            {letters.map((letter, i) => (
              <LetterCard key={letter.id} letter={letter} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
