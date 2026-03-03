import { Request, Response, NextFunction } from 'express'
import { cloudinaryService } from '../services/cloudinary.js'

export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
      return
    }

    const { buffer } = req.file

    const uploadResult = await cloudinaryService.uploadImage(buffer, 'quizbuzz-images')

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: uploadResult,
    })
  } catch (error) {
    next(error)
  }
}
