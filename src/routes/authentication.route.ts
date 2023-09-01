// Types
import type { User } from '@/utilities/types/models.type'
import type { Router, Request, Response } from 'express'

// Helpers
import TokenHelper from '@/utilities/helpers/token'

// Repos
import AuthenticationRepo from '@/repositories/authentication.repo'

// Error Handling
import BaseError from '@/utilities/errors/base.error'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'

// Other
import express from 'express'
import { requireFieldsOrParams } from '@/utilities/middleware/request.middleware'

const router: Router = express.Router()
const repo: AuthenticationRepo = new AuthenticationRepo()

// Create a new type without the id
type UserBody = Omit<User, 'id'>

router.post(
  '/',
  requireFieldsOrParams(['email', 'password'], 'body'),
  async (req: Request, res: Response) => {
    try {
      const user: UserBody = req.body

      // Validate the user
      const authenticatedUser = await repo.authenticateUser(
        user.email,
        user.password
      )

      await repo.userHasProfile(authenticatedUser.id)

      const tokenPayload = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
      }

      const token: string = await TokenHelper.getToken(tokenPayload)
      const headers = { Authorization: `Bearer ${token}` }

      // Return the token
      formatSuccessResponse(res, 200, null, headers)
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        formatErrorResponse(res, error.statusCode, error.message)
      } else {
        formatErrorResponse(res, 500, (error as Error).message)
      }
    }
  }
)

export default router
