// Types
import type { DatabaseResponse, Post } from '@/utilities/types'

// Services
import DatabaseService from '@/utilities/services/database'
import LoggerService from '@/utilities/services/logger'

// Error handling
import { RESPONSE } from '@/utilities/constants'
import { NotTheOwner } from '@/utilities/errors/authentication.error'
import { ResourceNotFound } from '@/utilities/errors/query.error'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

export default class PostRepo extends DatabaseService {
  constructor() {
    super()
  }

  /* SELECT orders.id,
      addresses.name,
      array_agg(DISTINCT products.sku )
  FROM orders 
  LEFT JOIN addresses
  ON orders.address_id = addresses.id
  LEFT JOIN line_items
  ON line_items.order_id = orders.id
  LEFT JOIN  products
  ON products.id = line_items.product_id
  GROUP BY orders.id,addresses.name */

  async getAll(): Promise<DatabaseResponse<Post[]>> {
    try {
      return await super.queryDB<Post[]>('SELECT * FROM posts')
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
        throw new ResourceNotFound(RESPONSE.RESOURCE.NOT_FOUND('post'), 404)
      }

      return post
    } catch (error: unknown) {
      logger.error((error as Error).message)
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
        throw new NotTheOwner(RESPONSE.RESOURCE.NOT_THE_OWNER, 404)
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
