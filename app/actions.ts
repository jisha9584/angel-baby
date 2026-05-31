'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { ActionResult, Letter, Song, Spark } from '@/types'

// Returns null when env vars aren't set yet — pages degrade gracefully
function serverSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function getMemories() {
  try {
    const supabase = serverSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) { console.error('getMemories:', error); return [] }
    return data ?? []
  } catch (e) {
    console.error('getMemories exception:', e)
    return []
  }
}

// Maps the form's media tabs to storage path prefixes.
const MEDIA_PREFIXES = { photo: 'photos', voice: 'voice', video: 'videos' } as const
type MediaKind = keyof typeof MEDIA_PREFIXES

export type SignedUploadResult =
  | { success: true; path: string; token: string; publicUrl: string }
  | { success: false; error: string }

/**
 * Authorize a single direct browser -> Supabase upload.
 *
 * The file itself never passes through this server (or Vercel, which caps
 * request bodies at ~4.5 MB). Instead the service role signs a one-time
 * upload URL for one specific path; the browser uploads straight to Supabase
 * storage using that token. The anon key gains no general write access.
 */
export async function createSignedUpload(kind: MediaKind, filename: string): Promise<SignedUploadResult> {
  const supabase = serverSupabase()
  if (!supabase) return { success: false, error: 'Database not configured yet.' }

  const prefix = MEDIA_PREFIXES[kind]
  if (!prefix) return { success: false, error: 'Unknown upload type.' }

  const safeName = (filename || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const path     = `${prefix}/${Date.now()}-${safeName}`

  const { data, error } = await supabase.storage.from('memory-images').createSignedUploadUrl(path)
  if (error || !data) {
    console.error('createSignedUpload:', error)
    return { success: false, error: 'Could not start the upload. Please try again.' }
  }

  const publicUrl = supabase.storage.from('memory-images').getPublicUrl(path).data.publicUrl
  return { success: true, path, token: data.token, publicUrl }
}

export async function createMemory(formData: FormData): Promise<ActionResult> {
  const supabase = serverSupabase()
  if (!supabase) {
    return { success: false, error: 'Database not configured yet. Add your Supabase keys to .env.local.' }
  }

  const name       = (formData.get('name')    as string)?.trim()
  const message    = (formData.get('message') as string)?.trim()
  const bouquetRaw = (formData.get('bouquet') as string) || '[]'
  // Media is uploaded directly from the browser first (see createSignedUpload);
  // by the time we get here we only receive the resulting public URLs.
  const imageUrl   = (formData.get('image_url') as string)?.trim() || null
  const voiceUrl   = (formData.get('voice_url') as string)?.trim() || null
  const videoUrl   = (formData.get('video_url') as string)?.trim() || null

  let bouquet: string[] | null = null
  try {
    const parsed = JSON.parse(bouquetRaw)
    if (Array.isArray(parsed) && parsed.length > 0) bouquet = parsed.slice(0, 5)
  } catch { /* ignore malformed JSON */ }

  if (!name || !message) return { success: false, error: 'Name and message are required.' }
  if (message.length > 2000) return { success: false, error: 'Message is too long (max 2000 characters).' }

  const { error: insertError } = await supabase
    .from('memories')
    .insert({ name, message, image_url: imageUrl, voice_url: voiceUrl, video_url: videoUrl, bouquet })

  if (insertError) { console.error('insert:', insertError); return { success: false, error: 'Something went wrong. Please try again.' } }

  revalidatePath('/memories')
  return { success: true }
}

export async function getSparks(): Promise<Spark[]> {
  try {
    const supabase = serverSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('sparks')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) { console.error('getSparks:', error); return [] }
    return data ?? []
  } catch (e) {
    console.error('getSparks exception:', e)
    return []
  }
}

export async function createSpark(formData: FormData): Promise<ActionResult> {
  const supabase = serverSupabase()
  if (!supabase) {
    return { success: false, error: 'Database not configured yet.' }
  }

  const text = (formData.get('text') as string)?.trim()
  const name = (formData.get('name') as string)?.trim() || null

  if (!text) return { success: false, error: 'Please write something.' }
  if (text.length > 120) return { success: false, error: 'Too long. Keep it to 120 characters.' }

  const { error } = await supabase.from('sparks').insert({ text, name })

  if (error) { console.error('createSpark:', error); return { success: false, error: 'Something went wrong.' } }

  revalidatePath('/memories')
  return { success: true }
}

// ─── Letters ────────────────────────────────────────────────────────────────

export async function getLetters(): Promise<Letter[]> {
  try {
    const supabase = serverSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) { console.error('getLetters:', error); return [] }
    return data ?? []
  } catch (e) {
    console.error('getLetters exception:', e)
    return []
  }
}

export async function createLetter(formData: FormData): Promise<ActionResult> {
  const supabase = serverSupabase()
  if (!supabase) return { success: false, error: 'Database not configured yet.' }

  const name       = (formData.get('name')    as string)?.trim()
  const message    = (formData.get('message') as string)?.trim()
  const bouquetRaw  = (formData.get('bouquet') as string) || '[]'

  if (!name || !message) return { success: false, error: 'Please fill in your name and letter.' }
  if (message.length > 5000) return { success: false, error: 'Letter is too long (max 5000 characters).' }

  let bouquet: string[] | null = null
  try {
    const parsed = JSON.parse(bouquetRaw)
    if (Array.isArray(parsed) && parsed.length > 0) bouquet = parsed.slice(0, 5)
  } catch { /* ignore malformed JSON */ }

  let { error } = await supabase.from('letters').insert({ name, message, bouquet })
  // Gracefully handle databases that don't have the bouquet column yet —
  // the letter still sends, the flowers just aren't persisted.
  if (error && /bouquet/i.test(error.message ?? '')) {
    ;({ error } = await supabase.from('letters').insert({ name, message }))
  }
  if (error) { console.error('createLetter:', error); return { success: false, error: 'Something went wrong. Please try again.' } }

  revalidatePath('/letters')
  return { success: true }
}

// ─── Songs ──────────────────────────────────────────────────────────────────

export async function getSongs(): Promise<Song[]> {
  try {
    const supabase = serverSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) { console.error('getSongs:', error); return [] }
    return data ?? []
  } catch (e) {
    console.error('getSongs exception:', e)
    return []
  }
}

export async function createSong(formData: FormData): Promise<ActionResult> {
  const supabase = serverSupabase()
  if (!supabase) return { success: false, error: 'Database not configured yet.' }

  const title        = (formData.get('title')        as string)?.trim()
  const artist       = (formData.get('artist')       as string)?.trim()
  const note         = (formData.get('note')         as string)?.trim() || null
  const submitted_by = (formData.get('submitted_by') as string)?.trim() || null

  if (!title || !artist) return { success: false, error: 'Please provide the song title and artist.' }

  const { error } = await supabase.from('songs').insert({ title, artist, note, submitted_by })
  if (error) { console.error('createSong:', error); return { success: false, error: 'Something went wrong. Please try again.' } }

  revalidatePath('/music')
  return { success: true }
}
