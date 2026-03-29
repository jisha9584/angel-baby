import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser-safe Supabase client.
 * Use this in Client Components and for reading public data.
 * Row-Level Security on Supabase controls what the anon key can access.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
