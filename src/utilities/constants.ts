export const RESPONSE_MESSAGES = {
  INVALID_ID: 'Invalid ID',
  ID_MISMATCH: "The ID's don't match",
  SERVER_ERROR: 'Internal server error',
  CONTENT: {
    USER_EXISTS: 'This email is already in use',
    EMPTY_FIELDS: 'Not all fields were filled in',
    NOT_THE_OWNER: "You're not the owner",
  },
  TOKEN: {
    NO_TOKEN_PROVIDED: 'No token is provided',
    INVALID_TOKEN: 'This token is invalid',
  },
  AUTHORIZATION: {
    NO_ADMIN: "You're not an admin",
    INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
  },
  NOT_FOUND: {
    PROFILE: "This profile wasn't found",
    RESOURCE: "This resource wasn't found",
    USER: "This user wasn't found",
  },
} as const

type ObjectValues<T> = T[keyof T]
export type LogLevel = ObjectValues<typeof RESPONSE_MESSAGES>
