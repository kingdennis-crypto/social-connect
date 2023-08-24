type TypeResource = 'user' | 'post' | 'profile' | 'media'

const formatNotFoundMessage = (
  typeOfResource: TypeResource,
  id?: string
): string =>
  `The ${typeOfResource.toLowerCase()} ${
    id && `with id ${id}`
  } couldn't be found`

const formatResourceExistsMessage = (typeOfResource: TypeResource): string =>
  `This ${typeOfResource.toLowerCase()} already exists`

export const RESPONSE = {
  SERVER_ERROR: 'Internal server error',
  RESOURCE: {
    NOT_FOUND: formatNotFoundMessage,
    ALREADY_EXISTS: formatResourceExistsMessage,
    NOT_THE_OWNER: "You're not the owner of this resource",
  },
  REQUEST: {
    EMPTY_FIELDS: 'Not all fields were filled in',
    NON_MATCHING_ID: "The id's aren't matching",
  },
  AUTHORIZATION: {
    INVALID_CREDENTIALS: 'Invalid login credentials',
    EMAIL_IN_USE: 'This e-mail is already in use',
  },
  QUERY: {
    INVALID_ID: 'Invalid ID',
  },
}

export const RESPONSE_MESSAGES = {
  SERVER_ERROR: 'Internal server error',
  INVALID_ID: 'Invalid ID',
  ID_MISMATCH: "The ID's don't match",
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
