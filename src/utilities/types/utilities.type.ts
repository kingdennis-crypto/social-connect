import { UserRole } from '@/utilities/types/models.type'

export type DatabaseResponse<T> = {
  data: T
  count: number
}

export type DecodedToken = {
  iat: number
  exp: number
  role: UserRole
  id: number
  email: string
}
