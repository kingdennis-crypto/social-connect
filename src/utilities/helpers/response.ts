import { Response } from 'express'
import { DatabaseResponse, SuccessResponse } from '@/types'

export function formatSuccessResponse<T>(
  response: Response,
  statusCode: number,
  payload: DatabaseResponse<T>
): void {
  response.status(statusCode).json({
    statusCode: statusCode,
    timestamp: Date.now(),
    payload: payload,
  })
}

export function formatErrorResponse<T>(
  response: Response,
  statusCode: number,
  message: string
): void {
  response.status(statusCode).json({
    timestamp: Date.now(),
    statusCode: statusCode,
    message: message,
  })
}
