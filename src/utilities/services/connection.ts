import { Client } from 'pg'

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
  private async connect() {
    try {
      await this.client.connect()
      console.log('Connected to the database')
    } catch (error) {
      console.error('Error:', error)
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
