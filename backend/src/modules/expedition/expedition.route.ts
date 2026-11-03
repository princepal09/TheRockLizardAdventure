import express from 'express';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { expeditionController } from './expedition.container.js';
import { createExpeditionSchema, updateExpeditionSchema } from './expedition.schema.js';

const router = express.Router();

router.get('/', expeditionController.getPublishedExpeditionsController);
router.get('/slug/:slug', expeditionController.getPublishedExpeditionController);

router.use(verifyUser(authService));

router.post(
  '/',
  upload.single('coverImage'),
  validate(createExpeditionSchema),
  expeditionController.createExpeditionController,
);
router.get('/admin', expeditionController.getExpeditionsController);
router.get('/:expeditionId', expeditionController.getExpeditionController);
router.patch(
  '/:expeditionId',
  upload.single('coverImage'),
  validate(updateExpeditionSchema),
  expeditionController.updateExpeditionController,
);
router.delete('/:expeditionId', expeditionController.deleteExpeditionController);

export default router;
