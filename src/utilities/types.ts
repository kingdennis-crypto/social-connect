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

/**
 * MODELS
 */
export type User = {
  id: number
  email: string
  password: string
  role: UserRole
}

export type DecodedToken = {
  iat: number
  exp: number
  role: UserRole
  id: number
  email: string
}

export type UserRole = 'admin' | 'user'