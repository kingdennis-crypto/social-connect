import { Request, Response, NextFunction } from 'express'
import TokenHelper from '@/utilities/helpers/token'
import { InvalidToken, Unauthenticated } from './errors'
import { RESPONSE_MESSAGES } from './enums'
import LoggerService from './utilities/services/logger'
import { formatErrorResponse } from './utilities/helpers/response'
import { JsonWebTokenError } from 'jsonwebtoken'

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
      throw new Unauthenticated(RESPONSE_MESSAGES.NO_TOKEN)
    }

    // Verify the validity of the token
    const isValidToken = await TokenHelper.verifyToken(token)

    if (!isValidToken) {
      throw new InvalidToken(RESPONSE_MESSAGES.INVALID_TOKEN)
    }

    // If the token is valid, call next function
    return next()
  } catch (error: unknown) {
    if (error instanceof Unauthenticated) {
      formatErrorResponse(res, 500, (error as Error).message)
    } else if (error instanceof InvalidToken) {
      formatErrorResponse(res, 500, (error as Error).message)
    } else if (error instanceof JsonWebTokenError) {
      formatErrorResponse(res, 500, (error as Error).message)
    } else {
      logger.error((error as Error).message)
      formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
    }
  }
}
