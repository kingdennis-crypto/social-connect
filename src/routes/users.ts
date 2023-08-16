import express, { Request, Response, Router } from 'express'
import UserRepo from '@/repositories/user'
import type { DatabaseResponse, User } from '@/utilities/types'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'

import {
  ValidationError,
  PropertyRequiredError,
  NotFound,
  InvalidId,
  UserAlreadyExist,
} from '@/utilities/errors'

import { RESPONSE_MESSAGES } from '@/utilities/constants'
import EncryptionHelper from '@/utilities/helpers/encryption'

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
  } catch (error) {
    formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
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
  } catch (error) {
    if (error instanceof InvalidId) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof NotFound) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
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
    if (error instanceof PropertyRequiredError) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof UserAlreadyExist) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
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
    if (error instanceof InvalidId) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof PropertyRequiredError) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof ValidationError) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof NotFound) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
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
  } catch (error) {
    if (error instanceof InvalidId) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof NotFound) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
    }
  }
})

export default router
