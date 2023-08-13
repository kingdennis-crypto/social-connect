import PostRepo from '@/repositories/post'
import { RESPONSE_MESSAGES } from '@/utilities/enums'
import { PropertyRequiredError } from '@/utilities/errors'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'
import { isAuthenticated } from '@/utilities/middleware'
import { DatabaseResponse, DecodedToken, Post } from '@/utilities/types'
import express, { Request, Response, Router } from 'express'

const router: Router = express.Router()
const repo: PostRepo = new PostRepo()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await repo.getAllPublicPosts()
    formatSuccessResponse(res, 200, result)
  } catch (error) {
    formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
  }
})

router.post(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const decodedToken: DecodedToken = res.locals.decodedToken
      const body: Post = req.body

      if (!body.content) {
        throw new PropertyRequiredError(RESPONSE_MESSAGES.EMPTY_FIELDS)
      }

      const result: DatabaseResponse<Post[]> = await repo.createPost(
        decodedToken.id,
        body.content,
        body.is_public || false,
        body.media_url || null
      )

      formatSuccessResponse(res, 200, result)
    } catch (error) {
      if (error instanceof PropertyRequiredError) {
        formatErrorResponse(res, 400, (error as Error).message)
      } else {
        formatErrorResponse(res, 500, RESPONSE_MESSAGES.SERVER_ERROR)
      }
    }
  }
)

router.delete(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const decodedToken: DecodedToken = res.locals.decodedToken
      const postId: number = parseInt(req.params.id)

      const deletedPost = await repo.deletePost(postId, decodedToken.id)

      formatSuccessResponse(res, 200, deletedPost)
    } catch (error) {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
)

export default router
