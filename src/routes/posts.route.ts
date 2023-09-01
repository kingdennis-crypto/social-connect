// Types
import type {
  DatabaseResponse,
  DecodedToken,
} from '@/utilities/types/utilities.type'
import type { Post } from '@/utilities/types/models.type'
import type { Request, Response, Router } from 'express'

// Helpers
import upload from '@/utilities/helpers/upload'

// Repos
import PostRepo from '@/repositories/post.repo'

// Error Handling
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'

// Others
import express from 'express'
import BaseError from '@/utilities/errors/base.error'
import { requireFieldsOrParams } from '@/utilities/middleware/request.middleware'
import { isAuthenticated } from '@/utilities/middleware/authentication.middleware'

const router: Router = express.Router()

const repo: PostRepo = new PostRepo()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await repo.getAllPublicPosts()
    formatSuccessResponse(res, 200, result)
  } catch (error: unknown) {
    if (error instanceof BaseError) {
      formatErrorResponse(res, error.statusCode, error.message)
    } else {
      formatErrorResponse(res, 500, (error as Error).message)
    }
  }
})

router.post(
  '/',
  isAuthenticated,
  requireFieldsOrParams(['content', 'is_public'], 'body'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const decodedToken: DecodedToken = res.locals.decodedToken
      const body: Post = req.body

      const result: DatabaseResponse<Post[]> = await repo.createPost(
        decodedToken.id,
        body.content,
        body.is_public,
        body.media_url || null
      )

      formatSuccessResponse(res, 200, result)
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        formatErrorResponse(res, error.statusCode, error.message)
      } else {
        formatErrorResponse(res, 500, (error as Error).message)
      }
    }
  }
)

router.delete(
  '/:id',
  isAuthenticated,
  requireFieldsOrParams(['id'], 'param'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const decodedToken: DecodedToken = res.locals.decodedToken
      const postId: number = parseInt(req.params.id)

      const deletedPost = await repo.deletePost(postId, decodedToken.id)

      formatSuccessResponse(res, 200, deletedPost)
    } catch (error: unknown) {
      if (error instanceof BaseError) {
        formatErrorResponse(res, error.statusCode, error.message)
      } else {
        formatErrorResponse(res, 500, (error as Error).message)
      }
    }
  }
)

router.post(
  '/media',
  isAuthenticated,
  upload.array('file'),
  async (req: Request, res: Response) => {
    try {
      formatSuccessResponse(res, 200, { count: 0, data: 'Good job' })
    } catch (error) {
      if (error instanceof BaseError) {
        formatErrorResponse(res, error.statusCode, error.message)
      } else {
        formatErrorResponse(res, 500, (error as Error).message)
      }
    }
  }
)

export default router
