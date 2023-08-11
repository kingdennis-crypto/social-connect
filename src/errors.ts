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

export class InvalidId extends BaseError {}

export class UserAlreadyExist extends BaseError {}

export class InvalidLoginCredentials extends BaseError {}

/**
 * Error class indicating that the resource was not found
 * @class
 * @extends BaseError
 */
export class NotFound extends BaseError {}

/**
 * Error class indicating a validation error
 * @class
 * @extends BaseError
 */
export class ValidationError extends BaseError {}

/**
 * Error class indicating that a property required for validation is missing
 * @class
 * @extends
 */
export class PropertyRequiredError extends ValidationError {
  fields: string[]

  constructor(message: string, fields?: string[]) {
    super(message)
    this.fields = fields || []
  }
}
