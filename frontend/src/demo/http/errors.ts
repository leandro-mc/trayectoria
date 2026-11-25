import type { ApiError } from '@/types/api.types'

/**
 * Error with the same shape the backend's GlobalExceptionHandler produces, so
 * `extractApiError` and the UI's error states behave exactly as against the real API.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly reason: string,
    message: string,
    readonly details?: string[],
  ) {
    super(message)
  }

  toBody(): ApiError {
    return {
      timestamp: new Date().toISOString().slice(0, 19),
      status: this.status,
      error: this.reason,
      message: this.message,
      ...(this.details && { details: this.details }),
    }
  }
}

export const badRequest    = (message: string) => new HttpError(400, 'Bad Request', message)
export const unauthorized  = (message: string) => new HttpError(401, 'Unauthorized', message)
export const forbidden     = (message: string) => new HttpError(403, 'Forbidden', message)
export const notFound      = (message: string) => new HttpError(404, 'Not Found', message)
export const conflict      = (message: string) => new HttpError(409, 'Conflict', message)
export const unprocessable = (message: string) => new HttpError(422, 'Unprocessable Entity', message)
export const notImplemented = (message: string) => new HttpError(501, 'Not Implemented', message)

/** Bean-validation failure: "field: message" entries, like MethodArgumentNotValidException. */
export const validationFailed = (details: string[]) =>
  new HttpError(400, 'Bad Request', 'Validation failed', details)
