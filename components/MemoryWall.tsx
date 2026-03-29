'use client'

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

interface MemoryWallProps {
  memories: Memory[]
  loading?: boolean
}

export default function MemoryWall({ memories, loading = false }: MemoryWallProps) {
  if (loading) {
    return (
      <div className="masonry">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
      </div>
    )
  }
  if (memories.length === 0) return <EmptyState />

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
