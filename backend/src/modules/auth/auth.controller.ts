import { Request, Response } from 'express';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { clearCookies, setCookies } from '../../utils/auth/auth.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import { AuthService } from './auth.service.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  loginController = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.adminLogin(req.body);

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: 'Admin login successfully',
      data: {
        admin: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  loggedInUserController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new AppError('Admin not found', 404);
    }

    const result = await this.authService.getLoggedInUser(user.id);

    sendResponse(res, 200, {
      success: true,
      message: 'Admin fetched Successfully',
      data: result,
    });
  });

  refreshTokenController = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token not found', 401);
    }

    const result = await this.authService.refreshTokens(refreshToken);

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: result.accessToken,
      },
    });
  });

  updatePasswordController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;

    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    await this.authService.updatePassword(req.body, adminId);
    clearCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: 'Password changed successfully, Please login again',
    });
  });

  logoutController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    const refreshToken = req.cookies?.refreshToken;

    if (typeof refreshToken === 'string' && refreshToken) {
      await this.authService.logout(adminId, refreshToken);
    }

    clearCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: 'Logged out successfully',
    });
  });

  logoutAllController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;

    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    await this.authService.logoutAll(adminId);

    clearCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: 'Logged out from all devices successfully',
    });
  });

  forgotPasswordController = catchAsync(async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body);

    sendResponse(res, 200, {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  });

  resetPasswordController = catchAsync(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body);

    sendResponse(res, 200, {
      success: true,
      message: 'Password reset successfully. Please login again.',
    });
  });

  updateProfileController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    const result = await this.authService.updateProfile(adminId, req.body, req.file);
    sendResponse(res, 200, {
      success: true,
      message: 'Profile Updated successfully',
      data: result,
    });
  });
}
