import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';
import { bulkActionSchema } from '../../utils/common/bulk-action.schema.js';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload, uploadGalleryImages } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { updateGalleryImageSchema } from '../gallery/gallery.schema.js';
import { createItinerarySchema, updateItinerarySchema } from '../itinerary/itinerary.schema.js';
import { tripController } from './trip.container.js';
import { createTripSchema, updateTripSchema } from './trip.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, tripController.getPublishedTripsController);
router.get('/slug/:slug', publicReadLimiter, tripController.getPublishedTripController);

router.use(verifyUser(authService));
router.patch('/bulk/publish', validate(bulkActionSchema), tripController.publishSelectedController);
router.delete('/bulk', validate(bulkActionSchema), tripController.deleteSelectedController);

router.post(
  '/',
  upload.single('coverImage'),
  validate(createTripSchema),
  tripController.createTripController,
);
router.get('/admin', tripController.getTripsController);
router.get('/:tripId', tripController.getTripController);
router.patch(
  '/:tripId',
  upload.single('coverImage'),
  validate(updateTripSchema),
  tripController.updateTripController,
);
router.delete('/:tripId', tripController.deleteTripController);
router.post(
  '/:tripId/itineraries',
  validate(createItinerarySchema),
  tripController.createItineraryController,
);
router.patch(
  '/:tripId/itineraries/:itineraryId',
  validate(updateItinerarySchema),
  tripController.updateItineraryController,
);
router.delete('/:tripId/itineraries/:itineraryId', tripController.deleteItineraryController);

router.post('/:tripId/images', uploadGalleryImages, tripController.createGalleryImagesController);
router.patch(
  '/:tripId/images/:imageId',
  validate(updateGalleryImageSchema),
  tripController.updateGalleryImageController,
);
router.delete('/:tripId/images/:imageId', tripController.deleteGalleryImageController);

export default router;
