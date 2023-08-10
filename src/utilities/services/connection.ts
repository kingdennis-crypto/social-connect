import { Client } from 'pg'

export default class ConnectionService {
  // The singleton instance
  private static instance: ConnectionService
  // The database client for access
  private client: Client

  // TODO: Think about making the connection object as a parameter
  private constructor() {
    const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env
    console.log({ POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD })

    this.client = new Client({
      host: '127.0.0.1',
      port: 5432,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD as string,
    })

    this.connect()
  }

  private async connect() {
    try {
      await this.client.connect()
      console.log('Connected to the database')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  public static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService()
    }

    return ConnectionService.instance
  }

  public getClient(): Client {
    return this.client
  }
}
