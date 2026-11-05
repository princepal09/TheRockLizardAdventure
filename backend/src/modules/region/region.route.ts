import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { regionController } from './region.container.js';
import { createRegionSchema, updateRegionSchema } from './region.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, regionController.getRegionsController);

router.use(verifyUser(authService));

router.post(
  '/',
  upload.single('image'),
  validate(createRegionSchema),
  regionController.createRegionController,
);
router.get('/:regionId', regionController.getRegionController);
router.patch(
  '/:regionId',
  upload.single('image'),
  validate(updateRegionSchema),
  regionController.updateRegionController,
);
router.delete('/:regionId', regionController.deleteRegionController);

export default router;
