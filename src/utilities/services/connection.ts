import { Client } from 'pg'
import LoggerService from '@/utilities/services/logger'

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

// TODO: When no connection is present no route works. Make error handling for if there is no connection

/**
 * A singleton class that initializes a connection with Postgres for dependency injection
 * @class
 */
export default class ConnectionService {
  // The singleton instance
  private static instance: ConnectionService
  // The database client for access
  private client: Client

  /**
   * Initializes the database connection
   * @constructor
   * @private
   */
  private constructor() {
    // TODO: Think about making the connection object as a parameter
    const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env

    this.client = new Client({
      host: '127.0.0.1',
      port: 5432,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD as string,
    })

    this.connect()
  }

  /**
   * Establish a connection with the database
   * @private
   * @async
   */
  private async connect(): Promise<void> {
    try {
      await this.client.connect()
      logger.info('Connected to the database')
    } catch (error) {
      logger.error('Database connection error: %s', (error as Error).message)
    }
  }

  public disconnect(): void {
    try {
      this.client.end()
      logger.info('Disconnected from the database')
    } catch (error) {
      logger.error('Database connection error:', (error as Error).message)
    }
  }

  /**
   * Retrieves and returns the singleton instance of the ConnectionService class.
   * If no instance exists, create a new one and return it.
   * @static
   * @returns {ConnectionService} The singleton instance
   */
  public static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService()
    }

    return ConnectionService.instance
  }

  /**
   * Retrieves the PostgreSQL client for database access.
   * @returns {Client} The postgreSQL client instance.
   */
  public getClient(): Client {
    return this.client
  }
}
