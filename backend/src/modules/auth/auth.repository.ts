import { Admin } from '../../../generated/prisma/client.js';
import { IAuthRepository } from './auth.interface.js';
import { prisma } from '../../lib/prisma.js';

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
}
