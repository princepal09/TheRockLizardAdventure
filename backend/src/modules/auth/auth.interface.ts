import type { Admin } from '../../../generated/prisma/client.js';

export interface IAuthRepository {
  findAdminByEmail(email: string): Promise<Admin | null>;
  findAdminById(adminId: string): Promise<Admin | null>;
  saveRefreshToken(tokenHash: string, adminId: string, expiresAt: Date): Promise<void>;
  updateLastLogin(adminId: string): Promise<Admin | null>;
}
