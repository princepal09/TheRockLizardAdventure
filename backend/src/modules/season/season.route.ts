import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { seasonController } from './season.container.js';
import { createSeasonSchema, updateSeasonSchema } from './season.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, seasonController.getActiveSeasonsController);

router.use(verifyUser(authService));

router.post('/', validate(createSeasonSchema), seasonController.createSeasonController);
router.get('/admin', seasonController.getSeasonsController);
router.get('/:seasonId', seasonController.getSeasonController);
router.patch('/:seasonId', validate(updateSeasonSchema), seasonController.updateSeasonController);
router.delete('/:seasonId', seasonController.deleteSeasonController);

export default router;
