import express from 'express';

import { validate } from '../../middlewares/validate.middleware.js';
import {
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from './auth.schema.js';
import { authController, authService } from './auth.container.js';
import { verifyUser } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/muler.middleware.js';

const router = express.Router();

router.post('/login', validate(loginUserSchema), authController.loginController);
router.get('/me', verifyUser(authService), authController.loggedInUserController);
router.post('/refresh', authController.refreshTokenController);
router.post('/logout', verifyUser(authService), authController.logoutController);
router.post('/logout-all', verifyUser(authService), authController.logoutAllController);
router.patch(
  'change-password',
  verifyUser(authService),
  validate(updatePasswordSchema),
  authController.updatePasswordController,
);
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPasswordController,
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPasswordController,
);

router.patch(
  '/update-profile',
  verifyUser(authService),
  upload.single('profileImage'),
  validate(updateProfileSchema),
  authController.updateProfileController,
);

export default router;
