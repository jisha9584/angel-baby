'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import MemoryCard from './MemoryCard'
import type { Memory } from '@/types'

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="masonry-item"
    >
      <div className="bg-card-bg rounded-2xl shadow-card overflow-hidden">
        <div className="skeleton h-40 w-full" />
        <div className="p-4 space-y-2.5">
          <div className="skeleton h-3 rounded-full w-full" />
          <div className="skeleton h-3 rounded-full w-5/6" />
          <div className="skeleton h-3 rounded-full w-3/4" />
          <div className="skeleton h-3 rounded-full w-1/2 mt-4" />
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="col-span-full flex flex-col items-center justify-center py-28 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 text-mint-green/60"
      >
        <Leaf className="h-14 w-14 mx-auto" strokeWidth={1} />
      </motion.div>
      <h3 className="font-handwriting text-3xl text-warm-brown mb-3">
        The garden is waiting
      </h3>
      <p className="font-body text-light-brown max-w-sm leading-relaxed text-sm">
        Be the first to plant a memory here. Every word you share keeps his
        spirit alive and his garden growing.
      </p>
    </motion.div>
  )
}

function columnsFor(width: number) {
  if (width >= 1280) return 4
  if (width >= 1024) return 3
  if (width >= 640)  return 2
  return 1
}

interface MemoryWallProps {
  memories: Memory[]
  loading?: boolean
}

export default function MemoryWall({ memories, loading = false }: MemoryWallProps) {
  // Until we've measured the viewport on the client we render the plain CSS
  // flow (which matches the server render, so there's no hydration mismatch).
  // Once mounted we switch to fixed JS columns — see below.
  const [columnCount, setColumnCount] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setColumnCount(columnsFor(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (loading) {
    return (
      <div className="masonry">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
      </div>
    )
  }
  if (memories.length === 0) return <EmptyState />

  // First paint (server + pre-mount): a simple column-flow that's stable to
  // hydrate. This happens before any photo has loaded, so nothing reflows yet.
  if (columnCount === null) {
    return (
      <div className="masonry">
        {memories.map((memory, index) => (
          <div key={memory.id} className="masonry-item">
            <MemoryCard memory={memory} index={index} />
          </div>
        ))}
      </div>
    )
  }

  // Fixed columns: each card is permanently assigned to one column, so a photo
  // loading and changing height only nudges the cards beneath it in the same
  // column. Cards never jump between columns the way CSS `columns` rebalances.
  const columns: { memory: Memory; index: number }[][] =
    Array.from({ length: columnCount }, () => [])
  memories.forEach((memory, index) => {
    columns[index % columnCount].push({ memory, index })
  })

  return (
    <div className="flex items-start gap-6">
      {columns.map((column, ci) => (
        <div key={ci} className="flex-1 min-w-0 flex flex-col gap-6">
          {column.map(({ memory, index }) => (
            <MemoryCard key={memory.id} memory={memory} index={index} />
          ))}
        </div>
      ))}
    </div>
  )
}
