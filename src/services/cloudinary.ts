import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import multer from 'multer'
import { type Request } from 'express'
import { Readable } from 'stream'

import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../common/privateKeys.js'
import { AppError } from '../common/AppError.js'

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

class CloudinaryService {
  // Multer instance — stores file in memory as a buffer, never touches disk
  readonly upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req: Request, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true)
      } else {
        cb(new Error('Only image files are allowed'))
      }
    },
  })

  /**
   * Streams a buffer directly to Cloudinary without writing to disk.
   * @param buffer  - The file buffer from multer (req.file.buffer)
   * @param folder  - Cloudinary folder to upload into (default: 'uploads')
   */
  async uploadImage(buffer: Buffer, folder = 'uploads'): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result: UploadApiResponse | undefined) => {
          if (error) return reject(new AppError(error.message, error.http_code, 'CLOUDINARY_ERROR'))

          if (!result) return reject(new AppError('No result returned from Cloudinary', 500, 'CLOUDINARY_ERROR'))

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
          })
        }
      )

      // Convert the buffer to a readable stream and pipe it into the upload stream
      Readable.from(buffer).pipe(uploadStream)
    })
  }
}

// Export a singleton instance so the same multer config is reused app-wide
export const cloudinaryService = new CloudinaryService()
