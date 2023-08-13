/**
 * Base class for the custom error types
 * @class
 */
class BaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/* Error indicating an invalid ID */
export class InvalidId extends BaseError {}

/* Error indicating that a user already exists */
export class UserAlreadyExist extends BaseError {}

/* Error indicating invalid login credentials */
export class InvalidLoginCredentials extends BaseError {}

/* Error indicating unauthenticated access */
export class Unauthenticated extends BaseError {}

/* Error indicating an invalid token */
export class InvalidToken extends BaseError {}

/* Error indicating an invalid role */
export class InvalidRole extends BaseError {}

/* Error indicating access not allowed for the current owner */
export class NotTheOwner extends BaseError {}

/* Error indicating that the resource was not found*/
export class NotFound extends BaseError {}

/* Error indicating a validation error */
export class ValidationError extends BaseError {}

/* Error indicating that a property required for validation is missing */
export class PropertyRequiredError extends ValidationError {
  fields: string[]

  constructor(message: string, fields?: string[]) {
    super(message)
    this.fields = fields || []
  }
}
