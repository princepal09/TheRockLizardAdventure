import { ContentStatus, type Trek } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { ITrekRepository } from './trek.interface.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

export class TrekRepository implements ITrekRepository {
  async createTrek(
    data: CreateTrekDTO & { coverImagePublicId?: string | null },
    adminId: string,
  ): Promise<Trek> {
    return prisma.trek.create({ data: { ...data, createdBy: adminId } });
  }

  async findTreks(): Promise<Trek[]> {
    return prisma.trek.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] });
  }

  async findTrekById(id: string): Promise<Trek | null> {
    return prisma.trek.findUnique({ where: { id } });
  }

  async findPublishedTreks() {
    return prisma.trek.findMany({
      where: { status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findPublishedTrekBySlug(slug: string) {
    return prisma.trek.findUnique({
      where: { slug, status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
    });
  }

  async updateTrek(
    id: string,
    data: UpdateTrekDTO & { coverImagePublicId?: string | null },
    coverImagePublicId?: string | null,
  ): Promise<Trek> {
    const where = coverImagePublicId === undefined ? { id } : { id, coverImagePublicId };
    return prisma.trek.update({ where, data });
  }

  async deleteTrek(id: string): Promise<Trek> {
    return prisma.trek.delete({ where: { id } });
  }
}
