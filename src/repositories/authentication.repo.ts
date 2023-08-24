// Types
import type { DatabaseResponse, Profile, User } from '@/utilities/types'

// Services
import DatabaseService from '@/utilities/services/database'
import LoggerService from '@/utilities/services/logger'

// Helpers
import EncryptionHelper from '@/utilities/helpers/encryption'

// Error handling
import { InvalidLoginCredentials } from '@/utilities/errors/authentication.error'
import { ResourceNotFound } from '@/utilities/errors/query.error'
import { RESPONSE } from '@/utilities/constants'

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
   * @throws {ResourceNotFound} - Throws an error if the profile wasn't found
   * @throws {InvalidLoginCredentials} - Throws an error if authentication fails
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    try {
      const result: DatabaseResponse<User[]> = await super.queryDBWithValues(
        'SELECT * FROM users where email = $1',
        [email]
      )

      // If no user exists, return false
      if (result.count === 0) {
        throw new ResourceNotFound(RESPONSE.RESOURCE.NOT_FOUND('user'), 404)
      }

      // Compare the plain password against the stored password
      const isValid: boolean = await EncryptionHelper.checkPassword(
        password,
        result.data[0].password
      )

      if (!isValid) {
        throw new InvalidLoginCredentials(
          RESPONSE.AUTHORIZATION.INVALID_CREDENTIALS,
          401
        )
      }

      return result.data[0]
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }

  /**
   * Checks if a user has a profile in the database.
   * @param {numer} userId - The ID of the user whose profile presence is being checked.
   * @returns {Promise<DatabaseResponse<Profile>>} A promise that resolves with the database response containing the profile information.
   * @throws {ResourceNotFound} Throws and error if the profile wasn't found
   */
  async userHasProfile(userId: number): Promise<DatabaseResponse<Profile>> {
    try {
      const result: DatabaseResponse<Profile> = await super.queryDBWithValues(
        'SELECT * FROM profile WHERE user_id = $1',
        [userId]
      )

      if (result.count === 0) {
        throw new ResourceNotFound(RESPONSE.RESOURCE.NOT_FOUND('profile'), 404)
      }

      return result
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }
}
