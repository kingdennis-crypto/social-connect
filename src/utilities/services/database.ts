import { DatabaseResponse } from '@/types'
import ConnectionService from '@/utilities/services/connection'
import { Client, QueryResult } from 'pg'
import { formatDBObject } from '../helpers/return'
import LoggerService from './logger'

// Get the singleton instance
const service: ConnectionService = ConnectionService.getInstance()
const client: Client = service.getClient()

const loggerService = LoggerService.getInstance()
const logger = loggerService.getLogger()

/**
 * An abstract class that provides the base for the database service.
 * This class can be extended to create database-relates repositories
 * @abstract
 * @template T - The type of the query result rows
 */
export default abstract class DatabaseService {
  constructor() {}

  /**
   * Executes a query on the connected PostgreSQL database
   * @param {string} query - the SQL query to execute
   * @returns {Promise<T[]>} - A promise containing the results as rows
   * @throws {any} - Will throw error if executing the query failed
   */
  protected async queryDB<T>(query: string): Promise<DatabaseResponse<T>> {
    try {
      const result: QueryResult = await client.query(query)
      return formatDBObject<T>(result)
    } catch (error: unknown) {
      logger.error('Error executing query: %s', error)
      throw error
    }
  }

  /**
   * Executes a parameterized query on the database.
   * @param {string} query - The SQL query with placeholders for values.
   * @param {unknown[]} values - The values to be inserted into the placeholders
   * @template T - The type of data being formatted
   * @returns {DatabaseResponse<T>} - The formatted response object
   * @throws {any} - Will throw error if executing the query failed
   */
  protected async queryDBWithValues<T>(
    query: string,
    values: unknown[]
  ): Promise<DatabaseResponse<T>> {
    try {
      const result: QueryResult = await client.query(query, values)
      return formatDBObject(result)
    } catch (error: unknown) {
      logger.error('Error executing query: %s', error)
      throw error
    }
  }
}
