import express from 'express';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { uploadGalleryImages } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { galleryController } from './gallery.container.js';
import { updateSiteGalleryImageSchema } from './gallery.schema.js';

const router = express.Router();

router.get('/', galleryController.getActiveImagesController);

router.use(verifyUser(authService));

router.get('/admin', galleryController.getImagesController);
router.post('/', uploadGalleryImages, galleryController.createImagesController);
router.patch(
  '/:imageId',
  validate(updateSiteGalleryImageSchema),
  galleryController.updateImageController,
);
router.delete('/:imageId', galleryController.deleteImageController);

export default router;
