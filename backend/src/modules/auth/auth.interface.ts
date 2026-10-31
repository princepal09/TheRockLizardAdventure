import { Admin, RefreshToken } from '../../../generated/prisma/client.js';
import { IUpdatePasswordResponse } from './auth.response.js';

export interface IAuthRepository {
  findAdminByEmail(email: string): Promise<Admin | null>;
  findAdminById(adminId: string): Promise<Admin | null>;
  saveRefreshToken(tokenHash: string, adminId: string, expiresAt: Date): Promise<void>;
  updateLastLogin(adminId: string): Promise<Admin | null>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  deleteRefreshToken(id: string): Promise<void>;
  findRefreshTokensByAdminId(adminId: string): Promise<RefreshToken[]>;
  deleteRefreshTokensByAdminId(adminId: string): Promise<void>;
  updateAdminProfile(
    adminId: string,
    data: { name?: string; profileImageUrl: string, profileImagePublicId?:string},
  ): Promise<Admin | null>;
  updatePassword(adminId: string, currentPasswordHash: string): Promise<void>;
  findAdminByIdForUpdatePassword(adminId: string): Promise<IUpdatePasswordResponse | null>;
  createPasswordResetToken(adminId: string, tokenHash: string, expiresAt: Date): Promise<any>;
  findPasswordResetToken(tokenHash: string): Promise<any>;
  deletePasswordResetToken(tokenId: string): Promise<void>;
  deletePasswordResetTokensByAdminId(adminId: string): Promise<void>;
  resetPasswordTransaction(
    adminId: string,
    passwordHash: string,
    resetTokenId: string,
  ): Promise<void>;
}
