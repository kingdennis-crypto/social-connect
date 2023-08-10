import 'module-alias/register'
import dotenv from 'dotenv'

// Initialize .env environment
dotenv.config()

import UserRepo from '@/repositories/user'
import ConnectionService from './utilities/services/connection'

// Initialize services
ConnectionService.getInstance()

async function connectAndQuery() {
  const client = new UserRepo()

  console.log('QUERY', await client.getAll())
}

connectAndQuery()
