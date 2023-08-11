import { Response } from 'express'
import { DatabaseResponse } from '@/types'

export function formatSuccessResponse<T>(
  response: Response,
  statusCode: number,
  payload: DatabaseResponse<T> | null,
  customHeader?: Record<string, string>
): void {
  if (customHeader) {
    response.set(customHeader)
  }

  response.status(statusCode).json({
    success: true,
    statusCode,
    ...payload,
  })
}

export function formatErrorResponse(
  response: Response,
  statusCode: number,
  message: string
): void {
  response.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    error: {
      timestamp: Date.now(),
      message: message,
    },
  })
}
