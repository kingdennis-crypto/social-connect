// Types
import type { DatabaseResponse } from '@/utilities/types/utilities.type'

// Services
import DatabaseService from '@/utilities/services/database'
import LoggerService from '@/utilities/services/logger'

// Error handling
import { RESPONSE } from '@/utilities/constants'
import { ResourceNotFound } from '@/utilities/errors/query.error'

import { UserInnerJoinProfile } from '@/utilities/types'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

export default class ProfileRepo extends DatabaseService {
  constructor() {
    super()
  }

  async createProfile(
    userId: number,
    username: string,
    bio: string,
    profile_image?: string
  ): Promise<DatabaseResponse<UserInnerJoinProfile[]>> {
    try {
      // TODO: Add validation to check if a profile already exists
      const result = await super.queryDBWithValues<UserInnerJoinProfile[]>(
        `WITH inserted_profile AS (
           INSERT INTO profile (user_id, username, bio, profile_image)
           VALUES ($1, $2, $3, $4) RETURNING *
         ) SELECT inserted_profile.*, users.email, users.role FROM inserted_profile 
         INNER JOIN users
         ON users.id = inserted_profile.user_id`,
        [userId, username, bio, profile_image || null]
      )

      return result
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }

  async getProfileByEmail(email: string): Promise<DatabaseResponse<unknown>> {
    try {
      const result = await super.queryDBWithValues<unknown>(
        `SELECT profile.*, users.email, users.role
        FROM users
        INNER JOIN profile
        ON users.id = profile.user_id
        WHERE users.email = $1`,
        [email]
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

  async getProfileByUserId(
    userId: number
  ): Promise<DatabaseResponse<UserInnerJoinProfile[]>> {
    try {
      const result = await super.queryDBWithValues<UserInnerJoinProfile[]>(
        `SELECT profile.*, users.email, users.role
         FROM users
         INNER JOIN profile
         ON users.id = profile.user_id
         WHERE users.id = $1
        `,
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

  async getProfileByProfileId(
    profileId: number
  ): Promise<DatabaseResponse<UserInnerJoinProfile[]>> {
    try {
      const profile = await super.queryDBWithValues<UserInnerJoinProfile[]>(
        `SELECT profile.*, users.email, users.role
         FROM profile
         INNER JOIN users
         ON users.id = profile.user_id
         WHERE profile.profile_id = $1
        `,
        [profileId]
      )

      if (profile.count === 0) {
        throw new ResourceNotFound(RESPONSE.RESOURCE.NOT_FOUND('profile'), 404)
      }

      return profile
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }
}
