import { Request, Response, NextFunction } from 'express'
import TokenHelper from '@/utilities/helpers/token'
import { InvalidRole, InvalidToken, Unauthenticated } from './errors'
import { RESPONSE_MESSAGES } from './constants'
import LoggerService from '@/utilities/services/logger'
import { formatErrorResponse } from '@/utilities/helpers/response'
import { JsonWebTokenError } from 'jsonwebtoken'
import { DecodedToken } from './types'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

/**
 * Middleware to check if a user is authentication using a JWT token
 * @param {Request} req - The express request object
 * @param {Response} res - The express response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>} - A promise that resolves once the middleware completes
 */
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token: string | undefined = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new Unauthenticated(RESPONSE_MESSAGES.TOKEN.NO_TOKEN_PROVIDED)
    }

    // Verify the validity of the token
    const isValidToken = await TokenHelper.verifyToken(token)

    if (!isValidToken) {
      throw new InvalidToken(RESPONSE_MESSAGES.TOKEN.INVALID_TOKEN)
    }

    // Store the decoded token into the request
    res.locals.decodedToken = TokenHelper.decodeToken(token)

    // If the token is valid, call the next function
    return next()
  } catch (error: unknown) {
    if (error instanceof Unauthenticated) {
      formatErrorResponse(res, 400, (error as Error).message)
    } else if (error instanceof InvalidToken) {
      formatErrorResponse(res, 400, (error as Error).message)
    } else if (error instanceof JsonWebTokenError) {
      formatErrorResponse(res, 400, (error as Error).message)
    } else {
      logger.error((error as Error).message)
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
}

/**
 * Middleware to check if a user is a admin
 * @param {Request} req - The express request object
 * @param {Response} res - The express response object
 * @param {NextFunction} next - The next middleware function
 * @returns {Promise<void>} - A promise that resolves once the middleware completes
 */
export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get the token from the local store
    const decodedToken: DecodedToken = res.locals.decodedToken

    if (decodedToken.role === 'user') {
      throw new InvalidRole(RESPONSE_MESSAGES.AUTHORIZATION.NO_ADMIN)
    }

    // If the user is a admin, call the next function
    return next()
  } catch (error) {
    if (error instanceof InvalidRole) {
      formatErrorResponse(res, 400, (error as Error).message)
    } else {
      logger.error((error as Error).message)
      formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
    }
  }
}

// export async function isOwnUser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     // Get the token from the local state
//     const decodedToken: DecodedToken = res.locals.decodedToken

//     return next()
//   } catch (error) {
//     logger.error((error as Error).message)
//     formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
//   }
// }
