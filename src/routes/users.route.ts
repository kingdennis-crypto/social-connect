// Types
import type { Request, Response, Router } from 'express'
import type { DatabaseResponse } from '@/utilities/types/utilities.type'
import type { User } from '@/utilities/types/models.type'

// Repos
import UserRepo from '@/repositories/user.repo'

// Helpers
import EncryptionHelper from '@/utilities/helpers/encryption'

// Error Handling
import { RESPONSE_MESSAGES } from '@/utilities/constants'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'

// Other
import express from 'express'

import {
  ValidationError,
  PropertyRequiredError,
  InvalidId,
} from '@/utilities/errors'
import BaseError from '@/utilities/errors/base.error'

const router: Router = express.Router()
const userRepo: UserRepo = new UserRepo()

// Create a new type without the id
type UserBody = Omit<User, 'id'>

// function getAllKeys<T extends object>(obj: T): Array<keyof T> {
//   return Object.keys(obj) as Array<keyof T>
// }

function isNumber(num: string): boolean {
  return !isNaN(parseFloat(num)) && isFinite(parseFloat(num))
}

/**
 * Route for retrieving all users
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users: DatabaseResponse<User[]> = await userRepo.getAll()
    formatSuccessResponse(res, 200, users)
  } catch (error: unknown) {
    if (error instanceof BaseError) {
      formatErrorResponse(res, error.statusCode, error.message)
    } else {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
})

/**
 * Route for retrieving a user by their id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const isValidId: boolean = isNumber(req.params.id)

    if (!isValidId) {
      throw new InvalidId(RESPONSE_MESSAGES.INVALID_ID)
    }

    const id: number = parseInt(req.params.id)
    const result: DatabaseResponse<User[]> = await userRepo.getById(id)
    formatSuccessResponse(res, 200, result)
  } catch (error: unknown) {
    if (error instanceof BaseError) {
      formatErrorResponse(res, error.statusCode, error.message)
    } else {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
})

/**
 * Route for retrieving all posts of a user
 */
router.get('/:id/posts', async (req: Request, res: Response) => {
  res.status(200).send('All posts')
})

/**
 * Route for creating a new user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const user: UserBody = req.body

    if (!(user.email && user.password)) {
      throw new PropertyRequiredError(RESPONSE_MESSAGES.CONTENT.EMPTY_FIELDS)
    }

    // Encrypt the password with bcrypt
    const hashedPassword = await EncryptionHelper.hashPassword(user.password)

    // Create the user and return it
    const result: DatabaseResponse<User[]> = await userRepo.createUser(
      user.email,
      hashedPassword
    )
    formatSuccessResponse(res, 200, result)
  } catch (error) {
    if (error instanceof BaseError) {
      formatErrorResponse(res, error.statusCode, error.message)
    } else {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
})

/**
 * Route for updating a user by its id
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const isValidId: boolean = isNumber(req.params.id)

    if (!isValidId) {
      throw new InvalidId(RESPONSE_MESSAGES.INVALID_ID)
    }

    const id: number = parseInt(req.params.id)
    const user: User = req.body

    if (!(user.id && user.email)) {
      throw new PropertyRequiredError(RESPONSE_MESSAGES.CONTENT.EMPTY_FIELDS)
    }

    if (id !== user.id) {
      throw new ValidationError(RESPONSE_MESSAGES.ID_MISMATCH)
    }

    // Update the user and return the returned data
    const result: DatabaseResponse<User[]> = await userRepo.updateUser(id, user)
    formatSuccessResponse(res, 200, result)
  } catch (error: unknown) {
    if (error instanceof BaseError) {
      formatErrorResponse(res, error.statusCode, error.message)
    } else {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
})

/**
 * Route for deleting a user by its id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const isValidId: boolean = isNumber(req.params.id)

    if (!isValidId) {
      throw new InvalidId(RESPONSE_MESSAGES.INVALID_ID)
    }

    const id: number = parseInt(req.params.id)

    const result: DatabaseResponse<User[]> = await userRepo.deleteUser(id)
    formatSuccessResponse(res, 200, result)
  } catch (error: unknown) {
    if (error instanceof BaseError) {
      formatErrorResponse(res, error.statusCode, error.message)
    } else {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
})

export default router
