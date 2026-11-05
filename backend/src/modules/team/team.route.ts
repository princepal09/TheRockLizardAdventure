import express from 'express';
import { publicReadLimiter } from '../../middlewares/rate-limit.middleware.js';
import { bulkActionSchema } from '../../utils/common/bulk-action.schema.js';
import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { teamController } from './team.container.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from './team.schema.js';

const router = express.Router();

router.get('/', publicReadLimiter, teamController.getActiveMembersController);

router.use(verifyUser(authService));
router.patch('/bulk/hide', validate(bulkActionSchema), teamController.hideSelectedController);

router.get('/admin', teamController.getMembersController);
router.get('/:memberId', teamController.getMemberController);
router.post(
  '/',
  upload.single('photo'),
  validate(createTeamMemberSchema),
  teamController.createMemberController,
);
router.patch(
  '/:memberId',
  upload.single('photo'),
  validate(updateTeamMemberSchema),
  teamController.updateMemberController,
);
router.delete('/:memberId', teamController.deleteMemberController);

export default router;
