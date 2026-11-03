import { ContentStatus, type Trek } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { ITrekRepository } from './trek.interface.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

export class TrekRepository implements ITrekRepository {
  async createTrek(data: CreateTrekDTO & { coverImagePublicId?: string | null }, adminId: string) {
    const { seasonIds, ...fields } = data;
    return prisma.trek.create({
      data: {
        ...fields,
        createdBy: adminId,
        seasons: seasonIds?.length
          ? { create: seasonIds.map((seasonId) => ({ seasonId })) }
          : undefined,
      },
      include: { seasons: { include: { season: true } } },
    });
  }

  async findTreks(): Promise<Trek[]> {
    return prisma.trek.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] });
  }

  async findTrekById(id: string) {
    return prisma.trek.findUnique({
      where: { id },
      include: { seasons: { include: { season: true } } },
    });
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
      include: { seasons: { where: { season: { isActive: true } }, include: { season: true } } },
    });
  }

  async updateTrek(
    id: string,
    data: UpdateTrekDTO & { coverImagePublicId?: string | null },
    coverImagePublicId?: string | null,
  ) {
    const where = coverImagePublicId === undefined ? { id } : { id, coverImagePublicId };
    const { seasonIds, ...fields } = data;
    return prisma.trek.update({
      where,
      data: {
        ...fields,
        seasons:
          seasonIds === undefined
            ? undefined
            : {
                deleteMany: seasonIds.length ? { seasonId: { notIn: seasonIds } } : {},
                connectOrCreate: seasonIds.map((seasonId) => ({
                  where: { trekId_seasonId: { trekId: id, seasonId } },
                  create: { seasonId },
                })),
              },
      },
      include: { seasons: { include: { season: true } } },
    });
  }

  async deleteTrek(id: string): Promise<Trek> {
    return prisma.trek.delete({ where: { id } });
  }
}
