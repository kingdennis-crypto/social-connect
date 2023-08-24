import BaseError from './base.error'

export class ValidationError extends BaseError {}

export class PropertyRequiredError extends ValidationError {}
