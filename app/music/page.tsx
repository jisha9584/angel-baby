import { getSongs } from '@/app/actions'
import { memorialConfig } from '@/config/memorial'
import SongCard from '@/components/SongCard'
import SongForm from '@/components/SongForm'
import StarField from '@/components/StarField'

export const metadata = {
  title: 'His Music · Angel Baby',
  description: 'The songs that were Rudraksh. Add one that reminds you of him.',
}

export const revalidate = 60

export default async function MusicPage() {
  const songs = await getSongs()

  return (
    <div className="paper-grain">

      {/* ── Night sky hero, quiet ─────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex flex-col justify-end pb-28 overflow-hidden hero-sky-quiet">
        <StarField count={80} />

        <div className="relative z-10 w-full max-w-[640px] mx-auto px-8">
          <p className="font-display text-[9px] tracking-[0.55em] uppercase text-purple-300/55 mb-8">
            his music
          </p>
          <h1
            className="font-handwriting text-white/85 leading-[0.95] mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            the soundtrack of him
          </h1>
          <p className="font-body text-base text-purple-100/45 leading-relaxed max-w-sm">
            every song here meant something to someone who loved him.
            press play and he is right back in the room.
          </p>
        </div>

        {/* Soft fade melting the night sky into the cream below */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F7F1E5)' }}
        />
      </section>

      {/* ── Spotify embed ─────────────────────────────────────────────────── */}
      {memorialConfig.spotifyEmbedUrl && (
        <section className="px-8 pt-24">
          <div className="max-w-[640px] mx-auto">
            <iframe
              src={memorialConfig.spotifyEmbedUrl}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-2xl"
            />
          </div>
        </section>
      )}

      {/* ── Add a song ────────────────────────────────────────────────────── */}
      <section className="px-8 pt-24">
        <div className="max-w-[640px] mx-auto">
          <SongForm />
        </div>
      </section>

      {/* ── The tracklist ─────────────────────────────────────────────────── */}
      <section className="px-8 pt-16 pb-36">
        <div className="max-w-[640px] mx-auto">
          {songs.length === 0 ? (
            <div className="pt-8 border-t border-warm-brown/10">
              <p className="font-handwriting text-3xl text-warm-brown/25">
                be the first to add a song
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {songs.map((song, i) => (
                <SongCard key={song.id} song={song} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
