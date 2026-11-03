import { randomUUID } from 'node:crypto';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.config.js';
import { IPayload } from '../../types/index.js';

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

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayload;
};
