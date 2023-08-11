// import { v4 as uuidv4 } from 'uuid'
import LoggerService from '../services/logger'
import jwt from 'jsonwebtoken'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

// const SECRET = 'secret'

export default class TokenHelper {
  constructor() {}

  private static getIatTime(timeInSeconds: number): number {
    return Math.floor(Date.now() / 1000) - timeInSeconds
  }

  private static getExpTime(timeInMinutes: number): number {
    return Math.floor(Date.now() / 1000) + timeInMinutes
  }

  static async getToken(): Promise<string> {
    try {
      const token = jwt.sign(
        {
          foo: 'bar',
          iat: this.getIatTime(30),
          exp: this.getExpTime(60 * 60),
        },
        'SECRET'
      )

      return token
    } catch (error: unknown) {
      logger.error('Token retrieval went wrong: %s', (error as Error).message)
      throw error
    }
  }
}
