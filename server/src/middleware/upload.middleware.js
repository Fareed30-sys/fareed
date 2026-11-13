import multer from 'multer';
import { errorResponse } from '../utils/response.js';

// Use memory storage for in-memory buffer validation before uploading to Supabase Storage
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

export const uploadCropImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
}).single('image');

/**
 * Validates image buffer magic bytes to ensure the file matches its declared extension and MIME type.
 * Protects against disguised malicious uploads.
 */
export const validateImageSignature = (buffer) => {
  if (!buffer || buffer.length < 8) return false;

  // JPEG: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpeg) return 'image/jpeg';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  if (isPng) return 'image/png';

  // WebP: RIFF .... WEBP
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  if (isRiff && isWebp) return 'image/webp';

  return false;
};

/**
 * Express middleware wrapper to handle Multer errors and verify file signatures
 */
export const handleImageUploadMiddleware = (req, res, next) => {
  uploadCropImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, 'Uploaded image exceeds the 5MB file size limit', 'FILE_TOO_LARGE', [], 400);
      }
      return errorResponse(res, err.message, 'FILE_UPLOAD_ERROR', [], 400);
    } else if (err) {
      return errorResponse(res, err.message, 'FILE_UPLOAD_ERROR', [], 400);
    }

    // If a file was uploaded, verify actual byte signature
    if (req.file) {
      const verifiedType = validateImageSignature(req.file.buffer);
      if (!verifiedType) {
        return errorResponse(
          res,
          'Corrupted or invalid image file signature. Please upload a genuine JPEG, PNG, or WebP photo.',
          'INVALID_IMAGE_SIGNATURE',
          [],
          400
        );
      }
      req.file.verifiedMimeType = verifiedType;
    }

    next();
  });
};

