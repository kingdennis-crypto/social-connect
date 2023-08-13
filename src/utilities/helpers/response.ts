import { Response } from 'express'
import { DatabaseResponse } from '@/utilities/types'

export function formatSuccessResponse<T>(
  response: Response,
  statusCode: number,
  payload: DatabaseResponse<T> | null,
  customHeader?: Record<string, string> | null,
  metadata?: object | null
): void {
  if (customHeader) {
    response.set(customHeader)
  }

  response.status(statusCode).json({
    success: true,
    statusCode,
    metadata: metadata,
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
