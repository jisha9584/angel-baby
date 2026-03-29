'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { ActionResult, Spark } from '@/types'

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
      .order('created_at', { ascending: false })

    if (error) { console.error('getMemories:', error); return [] }
    return data ?? []
  } catch (e) {
    console.error('getMemories exception:', e)
    return []
  }
}

export async function createMemory(formData: FormData): Promise<ActionResult> {
  const supabase = serverSupabase()
  if (!supabase) {
    return { success: false, error: 'Database not configured yet. Add your Supabase keys to .env.local.' }
  }

  const name        = (formData.get('name')    as string)?.trim()
  const message     = (formData.get('message') as string)?.trim()
  const bouquetRaw  = (formData.get('bouquet') as string) || '[]'
  const imageFile   = formData.get('image')  as File | null
  const voiceFile   = formData.get('voice')  as File | null
  const videoFile   = formData.get('video')  as File | null

  let bouquet: string[] | null = null
  try {
    const parsed = JSON.parse(bouquetRaw)
    if (Array.isArray(parsed) && parsed.length > 0) bouquet = parsed.slice(0, 5)
  } catch { /* ignore malformed JSON */ }

  if (!name || !message) return { success: false, error: 'Name and message are required.' }
  if (message.length > 2000) return { success: false, error: 'Message is too long (max 2000 characters).' }

  async function upload(file: File, prefix: string): Promise<string | null> {
    if (!file || file.size === 0) return null
    if (file.size > 50 * 1024 * 1024) return null   // 50 MB cap

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const path     = `${prefix}/${Date.now()}-${safeName}`

    const { data, error } = await supabase!.storage
      .from('memory-images')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (error) { console.error(`upload ${prefix}:`, error); return null }

    return supabase!.storage.from('memory-images').getPublicUrl(data.path).data.publicUrl
  }

  const [imageUrl, voiceUrl, videoUrl] = await Promise.all([
    imageFile && imageFile.size > 0 ? upload(imageFile, 'photos')  : Promise.resolve(null),
    voiceFile && voiceFile.size > 0 ? upload(voiceFile, 'voice')   : Promise.resolve(null),
    videoFile && videoFile.size > 0 ? upload(videoFile, 'videos')  : Promise.resolve(null),
  ])

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
  if (text.length > 120) return { success: false, error: 'Too long — keep it to 120 characters.' }

  const { error } = await supabase.from('sparks').insert({ text, name })

  if (error) { console.error('createSpark:', error); return { success: false, error: 'Something went wrong.' } }

  revalidatePath('/memories')
  return { success: true }
}
