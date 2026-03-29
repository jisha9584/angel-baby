import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes without conflicts — used throughout shadcn components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Derives a stable rotation angle (–3 … +3 degrees) from a memory's UUID.
 * Because it's deterministic, the angle is identical on server and client —
 * no hydration mismatch.
 */
export function stableRotation(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // convert to 32-bit integer
  }
  // Map to –3 … +3 degrees
  return ((Math.abs(hash) % 60) - 30) / 10
}

/** Friendly relative date — "2 days ago", "just now", etc. */
export function relativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return diffMins <= 1 ? 'just now' : `${diffMins} minutes ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  }
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7)  return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/** Format seconds as MM:SS — used by audio players throughout the app. */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/** Truncate a string to `max` characters with a soft ellipsis. */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}
