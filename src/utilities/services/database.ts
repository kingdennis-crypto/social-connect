import ConnectionService from '@/utilities/services/connection'
import { Client } from 'pg'

const service: ConnectionService = ConnectionService.getInstance()
const client: Client = service.getClient()

export default abstract class DatabaseService {
  constructor() {}

  async queryDB(query: string) {
    return (await client.query(query)).rows
  }
}
