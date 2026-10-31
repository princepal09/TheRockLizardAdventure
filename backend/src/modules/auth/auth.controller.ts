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
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  loggedInUserController = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new AppError('Admin not found', 404);
    }
    console.log('gee');

    const result = await this.authService.getLoggedInUser(user.id);

    sendResponse(res, 200, {
      success: true,
      message: 'Admin fetched Successfully',
      data: result,
    });
  });
}
