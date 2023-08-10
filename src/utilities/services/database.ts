import { DatabaseResponse } from '@/types'
import ConnectionService from '@/utilities/services/connection'
import { Client, QueryResult } from 'pg'
import { formatDBObject } from '../helpers/return'

// Get the singleton instance
const service: ConnectionService = ConnectionService.getInstance()
const client: Client = service.getClient()

/**
 * An abstract class that provides the base for the database service.
 * This class can be extended to create database-relates repositories
 * @abstract
 * @template T - The type of the query result rows
 */
export default abstract class DatabaseService<T> {
  constructor() {}

  /**
   * Executes a query on the connected PostgreSQL database
   * @param {string} query - the SQL query to execute
   * @returns {Promise<T[]>} - A promise containing the results as rows
   * @throws {any} - Will throw error if executing the query failed
   */
  async queryDB(query: string): Promise<DatabaseResponse<T>> {
    try {
      const result: QueryResult = await client.query(query)
      return formatDBObject(result)
    } catch (error: any) {
      console.error('Error executing query:', error)
      return Promise.reject(error)
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
  async queryDBWithValues(
    query: string,
    values: unknown[]
  ): Promise<DatabaseResponse<T>> {
    try {
      const result: QueryResult = await client.query(query, values)
      return formatDBObject(result)
    } catch (error) {
      console.error('Error executing query:', error)
      return Promise.reject(error)
    }
  }
}
