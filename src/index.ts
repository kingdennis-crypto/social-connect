import 'module-alias/register'
import dotenv from 'dotenv'

// Initialize .env environment
dotenv.config()

import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import ConnectionService from './utilities/services/connection'

const PORT: number = (process.env.PORT as unknown as number) || 3000
const BASE_URL: string = (process.env.BASE_URL as unknown as string) || '/api'

// Routes
import UserRoutes from '@/routes/users'

// Initialize services
ConnectionService.getInstance()

const APP: Application = express()

APP.use(bodyParser.urlencoded({ extended: true }))
APP.use(bodyParser.json())
APP.use(bodyParser.raw())

APP.use(cors())

APP.use('/users', UserRoutes)

APP.listen(PORT, (): void => {
  console.log(`Server is listening at port: ${PORT}`)
})

