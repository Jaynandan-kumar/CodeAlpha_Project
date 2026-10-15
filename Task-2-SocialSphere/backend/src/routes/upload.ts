import { Router, Response, Request } from 'express';
import multer from 'multer';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage (files stay in memory, not disk)
const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed.'));
    }
  },
});

/**
 * POST /api/upload
 * Upload an image and return its URL.
 * 
 * In production with Cloudinary configured:
 *   - Uploads the image to Cloudinary
 *   - Returns the Cloudinary URL
 * 
 * Without Cloudinary configured:
 *   - Returns a base64 data URL (for development/demo only)
 *   - This is NOT suitable for production
 */
router.post('/', authenticate, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const { buffer, mimetype, size, originalname } = req.file;

    // Validate size again (belt and suspenders)
    if (size > MAX_FILE_SIZE) {
      return res.status(413).json({ error: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB.` });
    }

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Production: Upload to Cloudinary
      try {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'socialsphere/posts',
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 1200, crop: 'limit' }, // Resize large images
                { quality: 'auto' }, // Auto quality
                { format: 'auto' }, // Auto format (WebP if supported)
              ],
            },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        return res.json({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError.message);
        return res.status(500).json({ error: 'Image upload failed. Please try again.' });
      }
    } else {
      // Development fallback: Return base64 data URL
      // WARNING: This is NOT suitable for production — large images will bloat the database
      console.warn('⚠️  Cloudinary not configured. Using base64 fallback (dev only).');
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimetype};base64,${base64}`;
      
      return res.json({
        url: dataUrl,
        publicId: null,
        width: null,
        height: null,
        format: mimetype.split('/')[1],
        warning: 'Cloudinary not configured. Using base64 data URL — not suitable for production.',
      });
    }
  } catch (error: any) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB.` });
    }
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
});

// Multer error handler
router.use((err: any, _req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default router;
