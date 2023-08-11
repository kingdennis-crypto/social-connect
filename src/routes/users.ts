import express, { Request, Response, Router } from 'express'
import UserRepo from '@/repositories/user'
import { DatabaseResponse, User } from '@/types'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'

import {
  ValidationError,
  PropertyRequiredError,
  NotFound,
  InvalidId,
} from '@/errors'

const router: Router = express.Router()
const repo: UserRepo = new UserRepo()

type UserBody = Omit<User, 'id'>

function getAllKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

function isNumber(num: string): boolean {
  return !isNaN(parseFloat(num)) && isFinite(parseFloat(num))
}

/**
 * Route for retrieving all users
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users: DatabaseResponse<User[]> = await repo.getAll()
    formatSuccessResponse(res, 200, users)
  } catch (error) {
    console.error('Error:', error)
    formatErrorResponse(res, 500, 'Internal server error')
  }
})

/**
 * Route for retrieving a user by their id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const isValidId: boolean = isNumber(req.params.id)

    if (!isValidId) {
      throw new InvalidId('Invalid ID')
    }

    const id: number = parseInt(req.params.id)
    const result: DatabaseResponse<User[]> = await repo.getById(id)
    formatSuccessResponse(res, 200, result)
  } catch (error) {
    if (error instanceof InvalidId) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof NotFound) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, 'Internal server error')
    }
  }
})

/**
 * Route for creating a new user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const user: UserBody = req.body

    if (!user.name) {
      throw new PropertyRequiredError('Not all fields were entered')
    }

    // Create the user and return it
    const result: DatabaseResponse<User[]> = await repo.createUser(user.name)
    formatSuccessResponse(res, 200, result)
  } catch (error) {
    if (error instanceof PropertyRequiredError) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, 'Internal server error')
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
      throw new InvalidId('Invalid ID')
    }

    const id: number = parseInt(req.params.id)
    const user: User = req.body

    if (!(user.id && user.name)) {
      throw new PropertyRequiredError('Not all fields were entered')
    }

    if (id !== user.id) {
      throw new ValidationError("Invalid: ID's don't match")
    }

    // Update the user and return the returned data
    const result: DatabaseResponse<User[]> = await repo.updateUser(id, user)
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
      formatErrorResponse(res, 500, 'Internal server error')
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
      throw new InvalidId('Invalid ID')
    }

    const id: number = parseInt(req.params.id)

    const result: DatabaseResponse<User[]> = await repo.deleteUser(id)
    formatSuccessResponse(res, 200, result)
  } catch (error) {
    if (error instanceof InvalidId) {
      formatErrorResponse(res, 400, error.message)
    } else if (error instanceof NotFound) {
      formatErrorResponse(res, 400, error.message)
    } else {
      formatErrorResponse(res, 500, 'Internal server error')
    }
  }
})

export default router