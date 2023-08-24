// Types
import type { Profile } from '@/utilities/types/models.type'
import type { DecodedToken } from '@/utilities/types/utilities.type'
import type { Request, Response, Router } from 'express'

// Repos
import ProfileRepo from '@/repositories/profile.repo'

// Error handling
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'

// Other
import { isAuthenticated } from '@/utilities/middleware'
import express from 'express'
import BaseError from '@/utilities/errors/base.error'

const router: Router = express.Router()
const repo: ProfileRepo = new ProfileRepo()

router.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const decodedToken: DecodedToken = res.locals.decodedToken

    const profile: Profile = req.body

    const result = await repo.createProfile(decodedToken.id, profile)
    formatSuccessResponse(res, 200, result)
  } catch (error: unknown) {
    formatErrorResponse(
      res,
      (error as BaseError).statusCode || 500,
      (error as Error).message
    )
  }
})

router.get('/:profile_id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.profile_id)
    const result = await repo.getProfileByProfileId(id)

    formatSuccessResponse(res, 200, result)
  } catch (error) {
    formatErrorResponse(
      res,
      (error as BaseError).statusCode || 500,
      (error as Error).message
    )
  }
})

export default router
