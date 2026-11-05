import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.config.js';

import { AppError } from './utils/common/error/AppError.js';
import authRoutes from './modules/auth/auth.route.js';
import regionRoutes from './modules/region/region.route.js';
import trekRoutes from './modules/trek/trek.route.js';
import expeditionRoutes from './modules/expedition/expedition.route.js';
import seasonRoutes from './modules/season/season.route.js';
import contactRoutes from './modules/contact/contact.route.js';
import siteSettingsRoutes from './modules/site-settings/site-settings.route.js';
import galleryRoutes from './modules/gallery/gallery.route.js';
import teamRoutes from './modules/team/team.route.js';
import dashboardRoutes from './modules/dashboard/dashboard.route.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

import { requestLogger } from './middlewares/request-logger.middleware.js';

export const app = express();
// Keep local/direct connections untrusted; configure verified proxy hops on the host.
app.set('trust proxy', env.TRUST_PROXY_HOPS || false);

app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
// Trip editors can contain several client-supplied policy/gear sections.
// Keep the smaller limit for enquiries, authentication and other endpoints.
app.use(['/api/v1/treks', '/api/v1/expeditions'], express.json({ limit: '256kb' }));
app.use(
  ['/api/v1/enquiries/bulk/read', '/api/v1/team/bulk/hide'],
  express.json({ limit: '256kb' }),
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health-check', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
    message: 'RockLizard Health is fine',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/regions', regionRoutes);
app.use('/api/v1/treks', trekRoutes);
app.use('/api/v1/expeditions', expeditionRoutes);
app.use('/api/v1/seasons', seasonRoutes);
app.use('/api/v1/enquiries', contactRoutes);
app.use('/api/v1/site-settings', siteSettingsRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use((req, _res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
