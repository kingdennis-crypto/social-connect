import { ResponseMessages } from '@/enums'
import { NotFound, UserAlreadyExist } from '@/errors'
import { DatabaseResponse, User } from '@/types'
import LoggerService from '@/utilities/services/logger'
import DatabaseService from '@/utilities/services/database'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

/**
 * Repository class for handling user-related database queries.
 * @class
 * @extends DatabaseService
 */
export default class UserRepo extends DatabaseService {
  constructor() {
    super()
  }

  /**
   * Retrieves all users from the database.
   * @returns {DatabaseResponse<User[]>} A promise containing all the users
   */
  async getAll(): Promise<DatabaseResponse<User[]>> {
    try {
      // TODO: Make toggle to return the password
      return await super.queryDB<User[]>('SELECT * FROM users')
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }

  /**
   * Retrieves a user by their ID from the database.
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<DatabaseResponse<User[]>>} A Promise containing the user.
   */
  async getById(id: number): Promise<DatabaseResponse<User[]>> {
    // TODO: Change so that it doesn't return a array of users but a single object
    try {
      const user = await super.queryDBWithValues<User[]>(
        'SELECT * FROM users WHERE id = $1',
        [id]
      )

      // If the user doesn't exist throw error
      if (user.count === 0) {
        throw new NotFound(ResponseMessages.USER_NOT_FOUND)
      }

      return user
    } catch (error: unknown) {
      if (error instanceof NotFound) {
        logger.error(ResponseMessages.USER_NOT_FOUND)
      } else {
        logger.error((error as Error).message)
      }

      throw error
    }
  }

  /**
   * Retrieves a user by their email.
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<DatabaseResponse<User[]>>} A promise containing the user.
   */
  async getUserByEmail(email: string): Promise<DatabaseResponse<User[]>> {
    try {
      return await super.queryDBWithValues<User[]>(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }

  /**
   * Creates a new user in the database.
   * @param {string} email - The email of the user to create.
   * @param {string} password - The password of the user to create.
   * @returns {Promise<DatabaseResponse<User[]>>} A Promise containing the created user.
   */
  async createUser(
    email: string,
    password: string
  ): Promise<DatabaseResponse<User[]>> {
    try {
      const user = await this.getUserByEmail(email)

      if (user.count > 0) {
        throw new UserAlreadyExist(ResponseMessages.USER_EXISTS)
      }

      return await super.queryDBWithValues<User[]>(
        'INSERT INTO users (email, password) values ($1, $2) RETURNING id, email',
        [email, password]
      )
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }

  /**
   * Deletes a user from the database by their ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<DatabaseResponse<User[]>>} A Promise containing the deleted user's information.
   */
  async deleteUser(id: number): Promise<DatabaseResponse<User[]>> {
    try {
      // Check if the user exist
      await this.getById(id)

      // Delete the user
      return await super.queryDBWithValues<User[]>(
        'DELETE FROM users WHERE id=$1 RETURNING id, email',
        [id]
      )
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }

  /**
   * Updates a user's information in the database.
   * @param {number} id - The ID of the user to update.
   * @param {User} user - The updated user object.
   * @returns {Promise<DatabaseResponse<User[]>>} A Promise containing the updated user's information.
   */
  async updateUser(id: number, user: User): Promise<DatabaseResponse<User[]>> {
    try {
      // Check if the user exist
      await this.getById(id)

      // Update the user object
      return await super.queryDBWithValues<User[]>(
        'UPDATE users SET email=$1 WHERE id=$2 RETURNING id, email',
        [user.email, id]
      )
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }
}
