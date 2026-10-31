import { AppError } from '../../utils/common/error/AppError.js';
import { IAuthRepository } from './auth.interface.js';
import { loginUserDTO } from './auth.schema.js';
import { comparePassword } from '../../utils/auth/password.js';
import { signAccessToken, signRefreshToken } from '../../utils/auth/jwt.js';
import { sanitizedUserResponse } from './auth.response.js';
import { IPayload } from './auth.types.js';
import { hashRefreshToken } from '../../utils/auth/auth.helper.js';

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}

  async adminLogin(body: loginUserDTO) {
    const { email, password } = body;
    const admin = await this.authRepo.findAdminByEmail(email);

    if (!admin) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!admin.isActive) {
      throw new AppError('Admin account is not active', 401);
    }

    const isPassword = await comparePassword(password, admin.passwordHash);
    if (!isPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const payloadAccess: IPayload = {
      id: admin.id,
      email: admin.email,
      type: 'access',
    };

    const payloadRefresh: IPayload = {
      id: admin.id,
      email: admin.email,
      type: 'refresh',
    };

    const accessToken = signAccessToken(payloadAccess);
    if (!accessToken) {
      throw new AppError('Failed to generate access token', 500);
    }

    const refreshToken = signRefreshToken(payloadRefresh);

    if (!refreshToken) {
      throw new AppError('Failed to generate refresh token', 500);
    }
    const hashRefresh = await hashRefreshToken(refreshToken);

    if (!hashRefresh) {
      throw new AppError('Failed to hash the refresh token', 500);
    }

    await this.authRepo.saveRefreshToken(
      hashRefresh,
      admin.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    await this.authRepo.updateLastLogin(admin.id);

    return {
      user: sanitizedUserResponse(admin),
      accessToken,
      refreshToken
    };
  }

  async getLoggedInUser(adminId: string) {
    const admin = await this.authRepo.findAdminById(adminId);
    console.log("yeye")
    if (!admin) {
      throw new AppError('User not found', 404);
    }
    return sanitizedUserResponse(admin);
  }
}
