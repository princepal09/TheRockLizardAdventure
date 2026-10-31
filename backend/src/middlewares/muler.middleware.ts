import multer from 'multer';
import path from 'path';

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
