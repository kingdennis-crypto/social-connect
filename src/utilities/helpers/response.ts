import { Response } from 'express'
import { DatabaseResponse, SuccessResponse } from '@/types'

export function formatSuccessResponse<T>(
  statusCode: number,
  payload: DatabaseResponse<T>
): SuccessResponse<T> {
  return {
    statusCode: statusCode,
    timestamp: Date.now(),
    payload: payload,
  }
}

export function formatErrorResponse<T>(
  response: Response,
  statusCode: number,
  message: string
) {
  response.status(statusCode).json({
    timestamp: Date.now(),
    statusCode: statusCode,
    message: message,
  })
}
