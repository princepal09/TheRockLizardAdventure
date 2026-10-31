import express from 'express';

import { validate } from '../../middlewares/validate.middleware.js';
import { loginUserSchema } from './auth.schema.js';
import { authController, authService } from './auth.container.js';
import { verifyUser } from '../../middlewares/auth.middleware.js';
 

const router = express.Router();

router.post('/login', validate(loginUserSchema), authController.loginController);
router.get('/me', verifyUser(authService), authController.loggedInUserController);

export default router;
