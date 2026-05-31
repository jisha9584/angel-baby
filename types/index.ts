export interface Memory {
  id:         string
  name:       string | null
  message:    string | null
  image_url:  string | null
  voice_url:  string | null
  video_url:  string | null
  bouquet:    string[] | null
  created_at: string
  deleted_at: string | null
}

export interface MemoryFormData {
  name:   string
  message: string
  image?: File | null
  voice?: Blob | null
  video?: File | null
}

export interface Spark {
  id:         string
  text:       string
  name:       string | null
  created_at: string
  deleted_at: string | null
}

export interface Letter {
  id:         string
  name:       string | null
  message:    string | null
  bouquet:    string[] | null
  created_at: string
  deleted_at: string | null
}

export interface Song {
  id:           string
  title:        string
  artist:       string | null
  note:         string | null
  submitted_by: string | null
  created_at:   string
  deleted_at:   string | null
}

export interface ActionResult {
  success: boolean
  error?: string
}
