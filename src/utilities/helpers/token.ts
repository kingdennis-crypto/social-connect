// import { v4 as uuidv4 } from 'uuid'
import LoggerService from '../services/logger'
import jwt from 'jsonwebtoken'
import { DecodedToken, UserRole } from '@/utilities/types'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

export default class TokenHelper {
  constructor() {}

  /**
   * Retrieves a new JWT token with a specified expiration time
   * @returns {Promise<string>} - A promise containing the generated token
   * @throws {Error} - Throws an error if token generation fails
   */
  static async getToken(
    payload?: { [key: string]: unknown },
    role: UserRole = 'user'
  ): Promise<string> {
    try {
      const token = jwt.sign(
        {
          iat: Math.floor(Date.now() / 1000) - 30, // 30 seconds backtrack
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
          role,
          ...payload,
        },
        'SECRET'
      )

      return token
    } catch (error: unknown) {
      logger.error('Token retrieval went wrong: %s', (error as Error).message)
      throw error
    }
  }

  /**
   * Decodes and verifies a JWT token.
   * @param {string} token - The JWT token to decode and verify
   * @returns {DecodedToken} - The decoded token's payload
   * @throws {Error} - If the token verification fails, an error is thrown
   */
  static decodeToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, 'SECRET') as DecodedToken
    } catch (error: unknown) {
      logger.error(
        'Token verification went wrong: %s',
        (error as Error).message
      )
      throw error
    }
  }

  /**
   * Verifies the validity of a JWT token
   * @param {string} token - The token to verify
   * @returns {Promise<boolean>} - Returns true if the token is valid, false otherwise
   * @throws {Error} - Throws an error if the token verification fails
   */
  static async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded: DecodedToken = this.decodeToken(token)
      // Checks if the tokens expiration is after this moment
      return Date.now() < decoded.exp * 1000
    } catch (error: unknown) {
      logger.error(
        'Token verification went wrong: %s',
        (error as Error).message
      )
      throw error
    }
  }
}
