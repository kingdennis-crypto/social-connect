/**
 * UTILITITES
 */
export type DatabaseResponse<T> = {
  data: T[]
  count: number
}

/**
 * MODELS
 */
export type User = {
  id: number
  name: string
}
