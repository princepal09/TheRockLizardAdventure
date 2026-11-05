import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';
import { bulkActionSchema } from '../../utils/common/bulk-action.schema.js';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload, uploadGalleryImages } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { updateGalleryImageSchema } from '../gallery/gallery.schema.js';
import { createItinerarySchema, updateItinerarySchema } from '../itinerary/itinerary.schema.js';
import { trekController } from './trek.container.js';
import { createTrekSchema, updateTrekSchema } from './trek.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, trekController.getPublishedTreksController);
router.get('/slug/:slug', publicReadLimiter, trekController.getPublishedTrekController);

router.use(verifyUser(authService));
router.patch('/bulk/publish', validate(bulkActionSchema), trekController.publishSelectedController);
router.delete('/bulk', validate(bulkActionSchema), trekController.deleteSelectedController);

router.post(
  '/',
  upload.single('coverImage'),
  validate(createTrekSchema),
  trekController.createTrekController,
);
router.get('/admin', trekController.getTreksController);
router.get('/:trekId', trekController.getTrekController);
router.patch(
  '/:trekId',
  upload.single('coverImage'),
  validate(updateTrekSchema),
  trekController.updateTrekController,
);
router.delete('/:trekId', trekController.deleteTrekController);
router.post(
  '/:trekId/itineraries',
  validate(createItinerarySchema),
  trekController.createItineraryController,
);
router.patch(
  '/:trekId/itineraries/:itineraryId',
  validate(updateItinerarySchema),
  trekController.updateItineraryController,
);
router.delete('/:trekId/itineraries/:itineraryId', trekController.deleteItineraryController);

router.post('/:trekId/images', uploadGalleryImages, trekController.createGalleryImagesController);
router.patch(
  '/:trekId/images/:imageId',
  validate(updateGalleryImageSchema),
  trekController.updateGalleryImageController,
);
router.delete('/:trekId/images/:imageId', trekController.deleteGalleryImageController);

export default router;
