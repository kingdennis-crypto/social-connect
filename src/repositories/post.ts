import { RESPONSE_MESSAGES } from '@/utilities/enums'
import { NotFound, NotTheOwner } from '@/utilities/errors'
import DatabaseService from '@/utilities/services/database'
import LoggerService from '@/utilities/services/logger'
import { DatabaseResponse, Post } from '@/utilities/types'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

export default class PostRepo extends DatabaseService {
  constructor() {
    super()
  }

  async getAll(): Promise<DatabaseResponse<Post[]>> {
    try {
      return await super.queryDB<Post[]>('SELECT * FROM posts')

      // return await super.queryDBWithValues<Post[]>(
      //   'SELECT * FROM posts LIMIT $1 OFFSET $2',
      //   [limit, offset]
      // )
    } catch (error) {
      logger.error((error as Error).message)
      throw error
    }
  }

  async getAllPublicPosts(): Promise<DatabaseResponse<Post[]>> {
    try {
      return await super.queryDB<Post[]>(
        'SELECT * FROM posts WHERE is_public = 1'
      )
    } catch (error) {
      logger.error((error as Error).message)
      throw error
    }
  }

  async getByPostId(id: number): Promise<DatabaseResponse<Post[]>> {
    try {
      const post = await super.queryDBWithValues<Post[]>(
        'SELECT * FROM posts WHERE post_id = $1',
        [id]
      )

      // If the post doesn't exists, throw error
      if (post.count === 0) {
        throw new NotFound(RESPONSE_MESSAGES.RESOURCE_NOT_FOUND)
      }

      return post
    } catch (error: unknown) {
      if (error instanceof NotFound) {
        logger.error(RESPONSE_MESSAGES.RESOURCE_NOT_FOUND)
      } else {
        logger.error((error as Error).message)
      }

      throw error
    }
  }

  async createPost(
    user_id: number,
    content: string,
    is_public: boolean = false,
    media_url: string | null = null
  ): Promise<DatabaseResponse<Post[]>> {
    try {
      const timestamp = new Date(new Date().toISOString())

      return await super.queryDBWithValues(
        'INSERT INTO posts (user_id, content, is_public, media_url, timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, content, +is_public, media_url, timestamp]
      )
    } catch (error) {
      logger.error((error as Error).message)
      throw error
    }
  }

  async deletePost(
    postId: number,
    userId: number
  ): Promise<DatabaseResponse<Post[]>> {
    try {
      // Check if the post exists
      const posts = await this.getByPostId(postId)
      const post: Post = posts.data[0]

      // Check if the user id is the same as the owner of the post
      if (post.user_id !== userId) {
        throw new NotTheOwner(RESPONSE_MESSAGES.NOT_THE_OWNER)
      }

      // Delete the post
      return await super.queryDBWithValues<Post[]>(
        'DELETE FROM posts WHERE post_id = $1 RETURNING *',
        [postId]
      )
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw error
    }
  }
}
