import type { Season } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateSeasonRecord, ISeasonRepository } from './season.interface.js';
import type { UpdateSeasonDTO } from './season.schema.js';

export class SeasonRepository implements ISeasonRepository {
  async createSeason(data: CreateSeasonRecord): Promise<Season> {
    return prisma.season.create({ data });
  }

  async findSeasons(isActive?: boolean): Promise<Season[]> {
    return prisma.season.findMany({
      where: { isActive },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
  }

  async findSeasonById(id: string): Promise<Season | null> {
    return prisma.season.findUnique({ where: { id } });
  }

  async updateSeason(id: string, data: UpdateSeasonDTO): Promise<Season> {
    return prisma.season.update({ where: { id }, data });
  }

  async deleteSeason(id: string): Promise<void> {
    await prisma.season.delete({ where: { id } });
  }
}
