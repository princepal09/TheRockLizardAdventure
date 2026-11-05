import { Admin, RefreshToken } from '../../../generated/prisma/client.js';
import type { IAuthRepository, PasswordNotificationRecipient } from './auth.interface.js';
import { prisma } from '../../lib/prisma.js';
import { IUpdatePasswordResponse } from './auth.response.js';

export class AuthRepository implements IAuthRepository {
  async findAdminByEmail(email: string): Promise<Admin | null> {
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    return admin;
  }

  async findAdminById(adminId: string): Promise<Admin | null> {
    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });
    return admin;
  }

  async saveRefreshToken(tokenHash: string, adminId: string, expiresAt: Date): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        adminId,
        expiresAt,
      },
    });
  }

  async updateLastLogin(adminId: string): Promise<Admin | null> {
    return prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findUnique({
      where: {
        tokenHash: token,
      },
    });
  }

  async deleteRefreshToken(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  async findRefreshTokensByAdminId(adminId: string): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({
      where: { adminId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteRefreshTokenByHash(adminId: string, tokenHash: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { adminId, tokenHash } });
  }

  async deleteRefreshTokensByAdminId(adminId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        adminId,
      },
    });
  }

  async updateAdminProfile(
    adminId: string,
    data: { name?: string; profileImageUrl: string; profileImagePublicId?: string },
  ): Promise<Admin | null> {
    const admin = await prisma.admin.update({
      where: {
        id: adminId,
      },
      data,
    });

    return admin;
  }

  async updatePassword(
    adminId: string,
    passwordHash: string,
  ): Promise<PasswordNotificationRecipient> {
    const [recipient] = await prisma.$transaction([
      prisma.admin.update({
        where: { id: adminId },
        data: { passwordHash },
        select: { email: true, name: true },
      }),
      prisma.refreshToken.deleteMany({ where: { adminId } }),
    ]);

    return recipient;
  }

  async findAdminByIdForUpdatePassword(adminId: string): Promise<IUpdatePasswordResponse | null> {
    const user = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        passwordHash: true,
      },
    });

    return user;
  }

  async createPasswordResetToken(
    adminId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<any> {
    return prisma.resetPasswordToken.create({
      data: {
        adminId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async findPasswordResetToken(tokenHash: string): Promise<any> {
    return prisma.resetPasswordToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async deletePasswordResetToken(tokenId: string): Promise<void> {
    await prisma.resetPasswordToken.delete({
      where: {
        id: tokenId,
      },
    });
  }

  async deletePasswordResetTokensByAdminId(adminId: string): Promise<void> {
    await prisma.resetPasswordToken.deleteMany({
      where: {
        adminId,
      },
    });
  }

  async resetPasswordTransaction(
    adminId: string,
    passwordHash: string,
    resetTokenId: string,
  ): Promise<PasswordNotificationRecipient> {
    const [recipient] = await prisma.$transaction([
      prisma.admin.update({
        where: { id: adminId },
        data: { passwordHash },
        select: { email: true, name: true },
      }),
      prisma.resetPasswordToken.delete({ where: { id: resetTokenId } }),
      prisma.refreshToken.deleteMany({ where: { adminId } }),
    ]);

    return recipient;
  }
}
