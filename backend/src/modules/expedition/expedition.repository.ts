import { ContentStatus, type Expedition } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { IExpeditionRepository } from './expedition.interface.js';
import type { CreateExpeditionDTO, UpdateExpeditionDTO } from './expedition.schema.js';

export class ExpeditionRepository implements IExpeditionRepository {
  async createExpedition(
    data: CreateExpeditionDTO & { coverImagePublicId?: string | null },
    adminId: string,
  ): Promise<Expedition> {
    return prisma.expedition.create({ data: { ...data, createdBy: adminId } });
  }

  async findExpeditions(): Promise<Expedition[]> {
    return prisma.expedition.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] });
  }

  async findExpeditionById(id: string): Promise<Expedition | null> {
    return prisma.expedition.findUnique({ where: { id } });
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
    });
  }

  async updateExpedition(
    id: string,
    data: UpdateExpeditionDTO & { coverImagePublicId?: string | null },
    coverImagePublicId?: string | null,
  ): Promise<Expedition> {
    const where = coverImagePublicId === undefined ? { id } : { id, coverImagePublicId };
    return prisma.expedition.update({ where, data });
  }

  async deleteExpedition(id: string): Promise<Expedition> {
    return prisma.expedition.delete({ where: { id } });
  }
}
