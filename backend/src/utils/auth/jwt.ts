import { randomUUID } from 'node:crypto';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.config.js';
import { IPayload } from '../../types/index.js';
import { AppError } from '../common/error/AppError.js';

export const signAccessToken = (payload: IPayload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const signRefreshToken = (payload: IPayload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
    jwtid: randomUUID(),
  });
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid or expired token', 401);
    }
    throw error;
  }
};

export const verifyAccessToken = (token: string) => {
  return verifyToken(token, env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return verifyToken(token, env.REFRESH_TOKEN_SECRET);
};
