import { createHash } from 'node:crypto';
import type { Request } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

const minute = 60_000;
const commonOptions = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  statusCode: 429,
} as const;

// Normalize IPv6 subnets too, so changing an IPv6 address cannot bypass the limit.
const ipAndEmailKey = (req: Request) => {
  const ip = ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? 'unknown');
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  return createHash('sha256')
    .update(JSON.stringify([ip, email]))
    .digest('hex');
};

const message = (text: string) => ({ success: false, status: 'fail', message: text });

// Each limiter has its own default MemoryStore. Counters reset on process restart.
export const loginLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * minute,
  limit: 5,
  keyGenerator: ipAndEmailKey,
  skipSuccessfulRequests: true,
  message: message('Too many failed login attempts. Please try again after 15 minutes.'),
});

export const forgotPasswordLimiter = rateLimit({
  ...commonOptions,
  windowMs: 60 * minute,
  limit: 3,
  keyGenerator: ipAndEmailKey,
  message: message('Too many password reset requests. Please try again after one hour.'),
});

export const enquiryLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * minute,
  limit: 5,
  message: message('Too many enquiry submissions. Please try again after 15 minutes.'),
});

// Reuse this instance across public routes: 120 total requests, not 120 per route.
export const publicReadLimiter = rateLimit({
  ...commonOptions,
  windowMs: minute,
  limit: 120,
  message: message('Too many requests. Please wait a minute and try again.'),
});
