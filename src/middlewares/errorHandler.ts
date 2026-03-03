import { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'
import { AppError } from '../common/AppError.js'

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Multer errors (file size, file type, etc.)
  if (err instanceof MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 5MB'
        : err.message

    res.status(400).json({ success: false, code: err.code, message })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    })
    return
  }

  if (err instanceof Error) {
    res.status(400).json({ success: false, message: err.message })
    return
  }

  res.status(500).json({ success: false, message: 'An unexpected error occurred duh' })
}
