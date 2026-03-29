import Link from 'next/link'
import { Plus } from 'lucide-react'
import MemoryWall from '@/components/MemoryWall'
import SparkWall from '@/components/SparkWall'
import SparkForm from '@/components/SparkForm'
import { getMemories, getSparks } from '@/app/actions'
import { memorialConfig } from '@/config/memorial'

export const revalidate = 60

export default async function MemoriesPage() {
  const [memories, sparks] = await Promise.all([getMemories(), getSparks()])

  return (
    <div className="min-h-screen">

      <section className="px-4 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <p className="font-display text-[9px] tracking-[0.45em] uppercase text-amber-500/80 mb-4">
            memory garden
          </p>
          <h1 className="font-handwriting text-5xl sm:text-6xl text-warm-brown mb-3">
            {memorialConfig.firstName}&apos;s wall
          </h1>
          <p className="font-body text-sm text-light-brown max-w-sm mx-auto leading-relaxed">
            every card here is a piece of him, held gently by the people who loved him most.
          </p>
          {memories.length > 0 && (
            <p className="mt-3 font-display text-[9px] tracking-[0.2em] uppercase text-amber-600/60">
              {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <MemoryWall memories={memories} />
      </section>

      {/* Sparks — quick words and feelings */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-28 space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-warm-yellow/50" />
            <p className="font-display text-[9px] tracking-[0.35em] uppercase text-amber-500/60">
              in their own words
            </p>
            <div className="h-px w-10 bg-warm-yellow/50" />
          </div>
          <p className="font-handwriting text-3xl text-warm-brown/75 mb-1">
            who was he to you?
          </p>
          <p className="font-body text-xs text-light-brown/50 max-w-xs mx-auto leading-relaxed">
            three words. one feeling. a small truth. whatever comes first.
          </p>
        </div>

        <SparkWall sparks={sparks} />
        <SparkForm />
      </section>

      <Link
        href="/add-memory"
        className="fixed bottom-8 right-6 z-30 flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-display text-[9px] tracking-[0.2em] uppercase pl-4 pr-5 py-3 rounded-full shadow-hover transition-all duration-200 active:scale-95 group"
        aria-label="Share a memory"
      >
        <Plus className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
        <span className="hidden sm:inline">share a memory</span>
        <span className="sm:hidden">add</span>
      </Link>
    </div>
  )
}
