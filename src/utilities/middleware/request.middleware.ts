import type { NextFunction, Request, Response } from 'express'
import { formatErrorResponse } from '../helpers/response'
import { RESPONSE } from '../constants'

/**
 * Middleware function that checks if specified fields or parameters are present in the request body or request parameters.
 * @param {string[]} fieldsOrParams - An array of field or parameter names to be checked for presence.
 * @param {'body' | 'param'} requestType - Specifies whether to check the request body or parameters.
 */
export const requireFieldsOrParams =
  (fieldsOrParams: string[], requestType: 'body' | 'param') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const isBody = requestType === 'body'

    const targetFieldList = isBody
      ? Object.keys(req.body)
      : Object.keys(req.params)

    const missingFields = fieldsOrParams.filter(
      (field: string) => !targetFieldList.includes(field)
    )

    if (missingFields.length > 0) {
      const responseMessage = isBody
        ? RESPONSE.REQUEST.EMPTY_FIELDS(fieldsOrParams)
        : RESPONSE.REQUEST.EMPTY_PARAMS(fieldsOrParams)

      return formatErrorResponse(res, 400, responseMessage)
    }

    next()
  }

export function setHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Remove the standard X-Powered-By header
  res.removeHeader('X-Powered-By')

  // Add some basic cache control for requesting browsers
  res.setHeader('Cache-Control', 'private, max-age=120')

  next()
}
