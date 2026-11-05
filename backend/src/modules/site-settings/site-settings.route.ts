import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { settingsController } from './site-settings.container.js';
import { updateSiteSettingsSchema } from './site-settings.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, settingsController.getSettingsController);
router.patch(
  '/',
  verifyUser(authService),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
  ]),
  validate(updateSiteSettingsSchema),
  settingsController.updateSettingsController,
);

export default router;
