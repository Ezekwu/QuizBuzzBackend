import { Router } from 'express'
import { uploadImage } from '../controllers/upload.controller.js'
import { cloudinaryService } from '../services/cloudinary.js'

const router = Router()

/**
 * @route   POST /upload/image
 * @desc    Upload an image directly to Cloudinary
 * @access  Public (Can be protected with auth middleware)
 */
router.post('/image', cloudinaryService.upload.single('image'), uploadImage)

export default router
