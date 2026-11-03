import express from 'express';
import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { teamController } from './team.container.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from './team.schema.js';

const router = express.Router();

router.get('/', teamController.getActiveMembersController);

router.use(verifyUser(authService));

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
