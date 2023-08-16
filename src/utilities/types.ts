type ErrorModule = typeof import('@/utilities/errors')
export type Error = ErrorModule[keyof ErrorModule]

/**
 * UTILITITES
 */
export type DatabaseResponse<T> = {
  data: T
  count: number
}

export type SuccessResponse<T> = {
  timestamp: number
  statusCode: number
  payload: DatabaseResponse<T>
}

export type ObjectValues<T> = T[keyof T]

// Function to view all inheritted types
export type Prettify<T> = {
  [K in keyof T]: T[K]
}

/**
 * MODELS
 */
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

export type DecodedToken = {
  iat: number
  exp: number
  role: UserRole
  id: number
  email: string
}

export type UserInnerJoinProfile = Prettify<
  Profile & Pick<User, 'email' | 'role'>
>

export type UserRole = 'admin' | 'user'
