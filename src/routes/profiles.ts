import ProfileRepo from '@/repositories/profile'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/utilities/helpers/response'
import { Profile } from '@/utilities/types'
import express, { Request, Response, Router } from 'express'

const router: Router = express.Router()
const repo: ProfileRepo = new ProfileRepo()

router.post('/', async (req: Request, res: Response) => {
  try {
    const profile: Profile = req.body

    const result = await repo.createProfile(profile)
    formatSuccessResponse(res, 200, result)
  } catch (error: unknown) {
    formatErrorResponse(res, 500, (error as Error).message)
  }
})

router.get('/:profile_id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.profile_id)
    const result = await repo.getProfileByProfileId(id)

    formatSuccessResponse(res, 200, result)
  } catch (error) {
    formatErrorResponse(res, 500, (error as Error).message)
  }
})

export default router
