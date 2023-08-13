export enum ResponseMessages {
  INVALID_ID = 'Invalid ID',
  EMPTY_FIELDS = 'Not all fields were filled in',
  ID_MISMATCH = "The ID's don't match",
  USER_NOT_FOUND = 'This user was not found',
  USER_EXISTS = 'This email is already in use',
  INVALID_LOGIN_CREDENTIALS = 'Invalid login credentials',
  SERVER_ERROR = 'Internal server error',
}

export const RESPONSE_MESSAGES = {
  INVALID_ID: 'Invalid ID',
  EMPTY_FIELDS: 'Not all fields were filled in',
  ID_MISMATCH: "The ID's don't match",
  USER_NOT_FOUND: 'This user was not found',
  USER_EXISTS: 'This email is already in use',
  INVALID_LOGIN_CREDENTIALS: 'Invalid login credentials',
  SERVER_ERROR: 'Internal server error',
  NOT_AUTHENTICATED: "You're not authenticated",
  NO_TOKEN: 'No token is provided',
  INVALID_TOKEN: 'This token is invalid',
  NO_ADMIN: "You're not a admin",
  RESOURCE_NOT_FOUND: 'The resource was not found',
  NOT_THE_OWNER: "You're not the owner",
} as const

type ObjectValues<T> = T[keyof T];
export type LogLevel = ObjectValues<typeof RESPONSE_MESSAGES>

// export type ResponseKeys = keyof typeof RESPONSE_MESSAGES
// export type ResponseRoute = (typeof RESPONSE_MESSAGES)[ResponseKeys]
