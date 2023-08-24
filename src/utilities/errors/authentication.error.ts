import BaseError from './base.error'

export class InvalidLoginCredentials extends BaseError {}

export class Unauthenticated extends BaseError {}

export class InvalidToken extends BaseError {}

export class InvalidRole extends BaseError {}

export class NotTheOwner extends BaseError {}

export class EmailAlreadyInUse extends BaseError {}
