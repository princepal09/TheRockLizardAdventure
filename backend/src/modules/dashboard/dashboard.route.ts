import express from 'express';
import { verifyUser } from '../../middlewares/auth.middleware.js';
import { authService } from '../auth/auth.container.js';
import { dashboardController } from './dashboard.container.js';

const router = express.Router();

router.get('/summary', verifyUser(authService), dashboardController.getSummaryController);

export default router;
