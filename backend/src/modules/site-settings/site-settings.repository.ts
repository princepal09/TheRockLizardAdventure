import { Prisma } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { ISiteSettingsRepository } from './site-settings.interface.js';

const settingsId = '00000000-0000-4000-8000-000000000001';

export class SiteSettingsRepository implements ISiteSettingsRepository {
  async findSettings() {
    const settings = await prisma.siteSettings.findUnique({ where: { id: settingsId } });
    return (
      settings ?? prisma.siteSettings.findFirst({ orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }] })
    );
  }

  async createSettings() {
    try {
      return await prisma.siteSettings.create({ data: { id: settingsId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return prisma.siteSettings.findUniqueOrThrow({ where: { id: settingsId } });
      }
      throw error;
    }
  }

  async updateSettings(
    id: string,
    data: Prisma.SiteSettingsUpdateInput,
    previousImages: { logoPublicId?: string | null; heroImagePublicId?: string | null },
  ) {
    return prisma.siteSettings.update({ where: { id, ...previousImages }, data });
  }
}
