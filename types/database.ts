export type Database = {
  public: {
    Tables: {
      memories: {
        Row: {
          id: string
          name: string
          message: string
          image_url:  string | null
          voice_url:  string | null
          video_url:  string | null
          bouquet:    string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          message: string
          image_url?:  string | null
          voice_url?:  string | null
          video_url?:  string | null
          bouquet?:    string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          message?: string
          image_url?:  string | null
          voice_url?:  string | null
          video_url?:  string | null
          bouquet?:    string[] | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
