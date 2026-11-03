import { AppError } from '../../utils/common/error/AppError.js';
import { IAuthRepository } from './auth.interface.js';
import {
  ForgotPasswordDTO,
  loginUserDTO,
  ResetPasswordDTO,
  updatePasswordDTO,
  UpdateProfileDTO,
} from './auth.schema.js';
import { comparePassword, hashPassword } from '../../utils/auth/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/auth/jwt.js';
import { sanitizedUserResponse } from './auth.response.js';
import { IPayload } from './auth.types.js';
import { compareRefreshToken, hashRefreshToken } from '../../utils/auth/auth.helper.js';
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
} from '../../utils/auth/password.reset.helper.js';
import { sendPasswordEmail } from '../../emails/services/send-password.email.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';

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
      refreshToken,
    };
  }

  async getLoggedInUser(adminId: string) {
    const admin = await this.authRepo.findAdminById(adminId);
    if (!admin) {
      throw new AppError('User not found', 404);
    }
    return sanitizedUserResponse(admin);
  }

  async refreshTokens(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }

    const tokens = await this.authRepo.findRefreshTokensByAdminId(decoded.id);

    const matchedToken = await Promise.any(
      tokens.map(async (token) => {
        const matched = compareRefreshToken(refreshToken, token.tokenHash);

        if (!matched) {
          throw new Error();
        }

        return token;
      }),
    ).catch(() => null);

    if (!matchedToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const payload = {
      id: decoded.id,
      email: decoded.email,
    };

    const newAccessToken = signAccessToken({
      ...payload,
      type: 'access',
    });

    const newRefreshToken = signRefreshToken({
      ...payload,
      type: 'refresh',
    });

    // Delete old refresh token
    console.log('OLD TOKEN ID:', matchedToken.id);

    await this.authRepo.deleteRefreshToken(matchedToken.id);
    console.log('OLD TOKEN DELETED');

    // Hash and save new refresh token
    const hashedRefreshToken = hashRefreshToken(newRefreshToken);

    await this.authRepo.saveRefreshToken(
      hashedRefreshToken,
      decoded.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(adminId: string, refreshToken: string): Promise<void> {
    await this.authRepo.deleteRefreshTokenByHash(adminId, hashRefreshToken(refreshToken));
  }

  async logoutAll(adminId: string): Promise<void> {
    await this.authRepo.deleteRefreshTokensByAdminId(adminId);
  }

  async updatePassword(body: updatePasswordDTO, adminId: string) {
    const { currentPassword, newPassword } = body;
    const user = await this.authRepo.findAdminByIdForUpdatePassword(adminId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordMatch = await comparePassword(currentPassword, user.passwordHash);

    if (!isPasswordMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    const newHashPassword = await hashPassword(newPassword);
    if (!newHashPassword) {
      throw new AppError('Failed to hash the new Password', 500);
    }

    await this.authRepo.updatePassword(adminId, newHashPassword);

    await this.authRepo.deleteRefreshTokensByAdminId(adminId);
  }

  async forgotPassword(body: ForgotPasswordDTO) {
    const { email } = body;
    const admin = await this.authRepo.findAdminByEmail(email);

    if (!admin) {
      return;
    }

    await this.authRepo.deletePasswordResetTokensByAdminId(admin.id);
    const resetToken = generatePasswordResetToken();
    const tokenHash = hashPasswordResetToken(resetToken);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.authRepo.createPasswordResetToken(admin.id, tokenHash, expiresAt);
    await sendPasswordEmail(admin.email, resetToken, admin.name);
  }

  async resetPassword(body: ResetPasswordDTO) {
    const { token, newPassword } = body;

    const tokenHash = hashPasswordResetToken(token);

    const resetToken = await this.authRepo.findPasswordResetToken(tokenHash);

    if (!resetToken) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    if (resetToken.expiresAt.getTime() < Date.now()) {
      await this.authRepo.deletePasswordResetToken(resetToken.id);

      throw new AppError('Invalid or expired reset token', 400);
    }

    const newPasswordHash = await hashPassword(newPassword);

    await this.authRepo.resetPasswordTransaction(
      resetToken.adminId,
      newPasswordHash,
      resetToken.id,
    );
  }

  async updateProfile(adminId: string, data: UpdateProfileDTO, file?: Express.Multer.File) {
    const admin = await this.authRepo.findAdminById(adminId);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    let profileImageUrl = admin.profileImageUrl as string;
    let profileImagePublicId = admin.profileImagePublicId as string;

    if (file) {
      const uploadedImage = await uploadToCloudinary(file, 'rocklizard/profiles');
      profileImageUrl = uploadedImage.secure_url;
      profileImagePublicId = uploadedImage.public_id;

      if (admin.profileImagePublicId) {
        await deleteFromCloudinary(admin.profileImagePublicId);
      }
    }

    const updatedAdmin = await this.authRepo.updateAdminProfile(adminId, {
      ...data,
      profileImageUrl,
      profileImagePublicId,
    });

    if (!updatedAdmin) {
      throw new AppError('Admin not found', 404);
    }

    return sanitizedUserResponse(updatedAdmin);
  }
}
