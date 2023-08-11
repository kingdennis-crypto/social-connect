import DatabaseService from '@/utilities/services/database'
import type { DatabaseResponse, User } from '@/types'
import LoggerService from '@/utilities/services/logger'
import EncryptionHelper from '@/utilities/helpers/encryption'
import { InvalidLoginCredentials } from '@/errors'
import { ResponseMessages } from '@/enums'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

/**
 * Repository class for handling authentication-related database queries.
 * @class
 * @extends DatabaseService
 */
export default class AuthenticationRepo extends DatabaseService {
  constructor() {
    super()
  }

  /**
   * Authenticates a user using their email and password
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<boolean>} - Returns true if authentication is successful, false otherwise
   * @throws {InvalidLoginCredentials} - Throws an error if authentication fails
   */
  async authenticateUser(email: string, password: string): Promise<boolean> {
    try {
      const result: DatabaseResponse<User[]> = await super.queryDBWithValues(
        'SELECT * FROM users where email = $1',
        [email]
      )

      // If no user exists, return false
      if (result.count === 0) {
        throw new InvalidLoginCredentials(
          ResponseMessages.INVALID_LOGIN_CREDENTIALS
        )
      }

      // Compare the plain password against the stored password
      const isValid: boolean = await EncryptionHelper.checkPassword(
        password,
        result.data[0].password
      )

      if (!isValid) {
        throw new InvalidLoginCredentials(
          ResponseMessages.INVALID_LOGIN_CREDENTIALS
        )
      }

      return isValid
    } catch (error) {
      logger.error((error as Error).message)
      throw error
    }
  }
}
