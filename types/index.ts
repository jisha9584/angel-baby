export interface Memory {
  id: string
  name: string
  message: string
  image_url:  string | null
  voice_url:  string | null
  video_url:  string | null
  bouquet:    string[] | null
  created_at: string
}

export interface MemoryFormData {
  name: string
  message: string
  image?: File | null
  voice?: Blob | null
  video?: File | null
}

export interface Spark {
  id: string
  text: string
  name: string | null
  created_at: string
}

export interface ActionResult {
  success: boolean
  error?: string
}
