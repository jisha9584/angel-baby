#!/usr/bin/env node
/**
 * Angel Baby — backup
 *
 * Saves a complete, restorable copy of everything people have left for
 * Rudraksh: every letter, memory, spark, and song (including soft-deleted
 * rows, so nothing is ever truly gone), plus every uploaded photo, voice
 * note, and video file.
 *
 * Output: backups/<timestamp>/
 *   tables/<table>.json   — full row dumps
 *   files/<path>          — every file from the memory-images bucket
 *   manifest.json         — counts + timestamp for a quick sanity check
 *
 * Run by hand:  node scripts/backup.mjs
 * (Reads Supabase URL + secret key from .env.local — keys never leave the file.)
 */

import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Off-machine copy: backups are also mirrored into Google Drive so they
// survive even if this laptop is lost. If Drive isn't mounted, the local
// backup still succeeds and the mirror is simply skipped.
const DRIVE_MIRROR = join(
  homedir(),
  'Library/CloudStorage/GoogleDrive-jisha.goyal1@gmail.com/My Drive/Angel Baby Backups'
)

// ── read .env.local (keys stay on disk, never printed) ──────────────────────
const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false } })

const TABLES = ['memories', 'sparks', 'letters', 'songs']
const BUCKET = 'memory-images'

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const outDir = join(ROOT, 'backups', stamp)
mkdirSync(join(outDir, 'tables'), { recursive: true })
mkdirSync(join(outDir, 'files'), { recursive: true })

const manifest = { created_at: new Date().toISOString(), tables: {}, files: 0 }

// ── tables (every row, deleted included) ────────────────────────────────────
for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true })
  if (error) {
    console.error(`  ! ${table}: ${error.message}`)
    manifest.tables[table] = `error: ${error.message}`
    continue
  }
  writeFileSync(join(outDir, 'tables', `${table}.json`), JSON.stringify(data, null, 2))
  manifest.tables[table] = data.length
  console.log(`  tables/${table}.json — ${data.length} row(s)`)
}

// ── storage files (recurse the whole bucket) ────────────────────────────────
async function listAll(prefix = '') {
  const out = []
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 })
  if (error) { console.error(`  ! list ${prefix || '/'}: ${error.message}`); return out }
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name
    if (item.id === null) out.push(...(await listAll(path))) // folder
    else out.push(path)
  }
  return out
}

const paths = await listAll()
for (const path of paths) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path)
  if (error) { console.error(`  ! file ${path}: ${error.message}`); continue }
  const dest = join(outDir, 'files', path)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, Buffer.from(await data.arrayBuffer()))
  manifest.files++
  console.log(`  files/${path}`)
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))

const totalRows = Object.values(manifest.tables).reduce((n, v) => n + (typeof v === 'number' ? v : 0), 0)
console.log(`\nBackup complete -> backups/${stamp}`)
console.log(`  ${totalRows} row(s) across ${TABLES.length} tables, ${manifest.files} file(s)`)

// ── mirror to Google Drive (off-machine safety) ─────────────────────────────
try {
  if (existsSync(dirname(DRIVE_MIRROR))) {
    cpSync(outDir, join(DRIVE_MIRROR, stamp), { recursive: true })
    console.log(`  mirrored to Google Drive -> Angel Baby Backups/${stamp}`)
  } else {
    console.log('  (Google Drive not mounted — local backup kept, mirror skipped)')
  }
} catch (e) {
  console.log(`  (could not mirror to Google Drive: ${e.message})`)
}
