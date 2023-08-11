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

// Routes
import UserRoutes from '@/routes/users'
import AuthenticationRoutes from '@/routes/authentication'

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

APP.use('/users', UserRoutes)
APP.use('/authentication', AuthenticationRoutes)

APP.listen(PORT, (): void => {
  logger.info('Server is listening at port: %d', PORT)
})

