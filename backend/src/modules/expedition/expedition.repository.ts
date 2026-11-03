import { ContentStatus, type Expedition } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { IExpeditionRepository } from './expedition.interface.js';
import type { CreateExpeditionDTO, UpdateExpeditionDTO } from './expedition.schema.js';

export class ExpeditionRepository implements IExpeditionRepository {
  async createExpedition(
    data: CreateExpeditionDTO & { coverImagePublicId?: string | null },
    adminId: string,
  ) {
    const { seasonIds, ...fields } = data;
    return prisma.expedition.create({
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

  async findExpeditions(): Promise<Expedition[]> {
    return prisma.expedition.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] });
  }

  async findExpeditionById(id: string) {
    return prisma.expedition.findUnique({
      where: { id },
      include: { seasons: { include: { season: true } } },
    });
  }

  async findPublishedExpeditions() {
    return prisma.expedition.findMany({
      where: { status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findPublishedExpeditionBySlug(slug: string) {
    return prisma.expedition.findUnique({
      where: { slug, status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
      include: { seasons: { where: { season: { isActive: true } }, include: { season: true } } },
    });
  }

  async updateExpedition(
    id: string,
    data: UpdateExpeditionDTO & { coverImagePublicId?: string | null },
    coverImagePublicId?: string | null,
  ) {
    const where = coverImagePublicId === undefined ? { id } : { id, coverImagePublicId };
    const { seasonIds, ...fields } = data;
    return prisma.expedition.update({
      where,
      data: {
        ...fields,
        seasons:
          seasonIds === undefined
            ? undefined
            : {
                deleteMany: seasonIds.length ? { seasonId: { notIn: seasonIds } } : {},
                connectOrCreate: seasonIds.map((seasonId) => ({
                  where: { expeditionId_seasonId: { expeditionId: id, seasonId } },
                  create: { seasonId },
                })),
              },
      },
      include: { seasons: { include: { season: true } } },
    });
  }

  async deleteExpedition(id: string): Promise<Expedition> {
    return prisma.expedition.delete({ where: { id } });
  }
}
