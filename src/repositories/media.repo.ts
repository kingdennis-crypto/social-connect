// Types
import type { Media } from '@/utilities/types/models.type'
import type { DatabaseResponse } from '@/utilities/types/utilities.type'

// Services
import DatabaseService from '@/utilities/services/database'
import LoggerService from '@/utilities/services/logger'

// Error handling
import { ResourceNotFound } from '@/utilities/errors/query.error'
import { RESPONSE } from '@/utilities/constants'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

export default class MediaRepo extends DatabaseService {
  constructor() {
    super()
  }

  async getMediaByPostId(postId: number): Promise<DatabaseResponse<Media[]>> {
    try {
      const result: DatabaseResponse<Media[]> = await super.queryDBWithValues(
        'SELECT id, url FROM post_media WHERE post_id = $1',
        [postId]
      )

      if (result.count === 0) {
        throw new ResourceNotFound(RESPONSE.RESOURCE.NOT_FOUND('media'), 404)
      }

      return result
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }
}
