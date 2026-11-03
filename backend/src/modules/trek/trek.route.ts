import express from 'express';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { trekController } from './trek.container.js';
import { createTrekSchema, updateTrekSchema } from './trek.schema.js';

const router = express.Router();

router.get('/', trekController.getPublishedTreksController);
router.get('/slug/:slug', trekController.getPublishedTrekController);

router.use(verifyUser(authService));

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

export default router;
