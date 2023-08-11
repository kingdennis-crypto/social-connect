import bcrypt from 'bcrypt'
import LoggerService from '../services/logger'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

const SALT_ROUNDS = 10

export default class EncryptionHelper {
  constructor() {}

  /**
   * Hashes a plain password using bcrypt with the specified number of salt rounds
   * @param {string} plainPassword - The password to hash
   * @returns {Promise<string>} The hashed password
   * @throws {unknown} - Throws an error if the hashing fails
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    try {
      return await bcrypt.hash(plainPassword, SALT_ROUNDS)
    } catch (error: unknown) {
      logger.error('Hashing went wrong: %s', (error as Error).message)
      throw error
    }
  }

  /**
   * Compares a plain password with a hashed password using bcrypt
   * @param {string} plainPassword - The plain password to be compared
   * @param {string} hashedPassword - The hashed password to compare against
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the passwords match
   * @throws {unknown} Throws an error if password comparison fails.
   */
  static async checkPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error: unknown) {
      logger.error('Comparing went wrong: %s', (error as Error).message)
      throw error
    }
  }
}
