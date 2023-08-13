import type { User } from '@/utilities/types'
import express, { Router, Request, Response } from 'express'
// import EncryptionHelper from '@/utilities/helpers/encryption'
import AuthenticationRepo from '@/repositories/authentication'
import TokenHelper from '@/utilities/helpers/token'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'
import { ResponseMessages } from '@/utilities/enums'
import { InvalidLoginCredentials } from '@/utilities/errors'

const router: Router = express.Router()
const repo: AuthenticationRepo = new AuthenticationRepo()

// Create a new type without the id
type UserBody = Omit<User, 'id'>

router.post('/', async (req: Request, res: Response) => {
  try {
    const user: UserBody = req.body

    // Validate the user
    const authenticatedUser = await repo.authenticateUser(
      user.email,
      user.password
    )
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
    if (error instanceof InvalidLoginCredentials) {
      formatErrorResponse(res, 400, ResponseMessages.INVALID_LOGIN_CREDENTIALS)
    } else {
      formatErrorResponse(res, 500, ResponseMessages.SERVER_ERROR)
    }
  }
})

export default router
