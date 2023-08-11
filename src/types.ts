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

/**
 * MODELS
 */
export type User = {
  id: number
  name: string
}
