import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service.js';
import { verifyAccessToken } from '../utils/auth/jwt.js'; // Fixed: use verification, not signing
import { AppError } from '../utils/common/error/AppError.js';

export const verifyUser = (authService: AuthService) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract access token from the Authorization header (sent from client memory)
      const authHeader = req.headers.authorization;
      const token =
        authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      if (!token) {
        throw new AppError('Unauthorized request: Missing access token', 401);
      }

      // Verify the access token signature and expiration
      const decoded = verifyAccessToken(token);

      if (!decoded || decoded.type !== 'access') {
        throw new AppError('Invalid or expired access token', 401);
      }

      req.user = await authService.getLoggedInUser(decoded.id);

      return next();
    } catch (error) {
      next(error);
    }
  };
};
