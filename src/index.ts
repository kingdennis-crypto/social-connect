import 'module-alias/register'
import dotenv from 'dotenv'

// Initialize .env environment
dotenv.config()

import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import ConnectionService from '@/utilities/services/connection'
import LoggerService from '@/utilities/services/logger'

const PORT: number = (process.env.PORT as unknown as number) || 3000

// Middleware
import { setHeaders } from './utilities/middleware/request.middleware'

// Routes
import UserRoutes from '@/routes/users.route'
import AuthenticationRoutes from '@/routes/authentication.route'
import PostRoutes from '@/routes/posts.route'
import ProfileRoutes from '@/routes/profiles.route'

// Initialize connection service
ConnectionService.getInstance()

// Initialize logger service
const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

const APP: Application = express()

APP.use(bodyParser.urlencoded({ extended: true }))
APP.use(bodyParser.json())
APP.use(bodyParser.raw())

APP.use(cors())

APP.use(setHeaders)

APP.use('/users', UserRoutes)
APP.use('/authentication', AuthenticationRoutes)
APP.use('/posts', PostRoutes)
APP.use('/profile', ProfileRoutes)

APP.listen(PORT, (): void => {
  logger.info('Server is listening at port: %d', PORT)
})
