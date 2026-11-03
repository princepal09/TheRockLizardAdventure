import type { Region } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateRegionRecord, IRegionRepository } from './region.interface.js';
import type { UpdateRegionDTO } from './region.schema.js';

export class RegionRepository implements IRegionRepository {
  async createRegion(data: CreateRegionRecord): Promise<Region> {
    return prisma.region.create({ data });
  }

  async findRegions(): Promise<Region[]> {
    return prisma.region.findMany({ orderBy: [{ name: 'asc' }, { id: 'asc' }] });
  }

  async findRegionById(id: string): Promise<Region | null> {
    return prisma.region.findUnique({ where: { id } });
  }

  async updateRegion(
    id: string,
    data: UpdateRegionDTO & { imagePublicId?: string | null },
    imagePublicId?: string | null,
  ): Promise<Region> {
    const where = imagePublicId === undefined ? { id } : { id, imagePublicId };
    return prisma.region.update({ where, data });
  }

  async deleteRegion(id: string): Promise<Region> {
    return prisma.region.delete({ where: { id } });
  }
}
