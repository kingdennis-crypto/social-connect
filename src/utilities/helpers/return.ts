import { DatabaseResponse } from '@/types'
import { QueryResult } from 'pg'

/**
 * Formats a database query result into a standardized response object.
 * @param {QueryResult} result - The query result object from the database
 * @template T - The type of data being formatted.
 * @returns {DatabaseResponse<T>} - The formatted response object
 */
export function formatDBObject<T>(result: QueryResult): DatabaseResponse<T> {
  return {
    count: result.rowCount,
    data: result.rows,
  }
}
