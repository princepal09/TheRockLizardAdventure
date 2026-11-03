import multer from 'multer';
import path from 'path';
import type { RequestHandler } from 'express';
import { AppError } from '../utils/common/error/AppError.js';

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  const extension = path.extname(file.originalname).toLowerCase();

  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
  const isValidExtension = allowedExtensions.includes(extension);

  if (isValidMimeType || isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, WEBP, and GIF images are allowed'));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

const uploadGalleryFiles = upload.array('images', 5);

export const uploadGalleryImages: RequestHandler = (req, res, next) => {
  uploadGalleryFiles(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('Upload up to 5 photos using the images field', 400));
    }

    if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    }

    return next(error);
  });
};
