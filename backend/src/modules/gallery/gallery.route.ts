import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { uploadGalleryImages } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { galleryController } from './gallery.container.js';
import { updateSiteGalleryImageSchema } from './gallery.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, galleryController.getActiveImagesController);

router.use(verifyUser(authService));

router.get('/admin', galleryController.getImagesController);
router.post('/', uploadGalleryImages, galleryController.createImagesController);
router.delete('/', galleryController.deleteAllImagesController);
router.patch(
  '/:imageId',
  validate(updateSiteGalleryImageSchema),
  galleryController.updateImageController,
);
router.delete('/:imageId', galleryController.deleteImageController);

export default router;
