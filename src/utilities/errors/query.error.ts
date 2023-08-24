import BaseError from './base.error'

export class ResourceNotFound extends BaseError {}

export class ResourceAlreadyExists extends BaseError {}

export class InvalidField extends BaseError {}
