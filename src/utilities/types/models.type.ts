export type UserRole = 'admin' | 'user'

export type User = {
  id: number
  email: string
  password: string
  role: UserRole
}

export type Post = {
  post_id: number
  user_id: number
  content: string
  media_url?: string
  timestamp: string
  is_public: boolean
}

export type Profile = {
  profile_id: number
  user_id: number
  username: string
  bio: string
  profile_image: string
}

export type Media = {
  id: number
  url: string
  post_id: number
}
