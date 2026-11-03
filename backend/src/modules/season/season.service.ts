import { Prisma } from '../../../generated/prisma/client.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { ISeasonRepository } from './season.interface.js';
import type { CreateSeasonDTO, UpdateSeasonDTO } from './season.schema.js';

export class SeasonService {
  constructor(private readonly seasonRepo: ISeasonRepository) {}

  async createSeason(data: CreateSeasonDTO) {
    try {
      return await this.seasonRepo.createSeason(data);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async getSeasons() {
    return this.seasonRepo.findSeasons();
  }

  async getActiveSeasons() {
    return this.seasonRepo.findSeasons(true);
  }

  async getSeason(id: string) {
    const season = await this.seasonRepo.findSeasonById(id);

    if (!season) {
      throw new AppError('Season not found', 404);
    }

    return season;
  }

  async updateSeason(id: string, data: UpdateSeasonDTO) {
    try {
      return await this.seasonRepo.updateSeason(id, data);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async deleteSeason(id: string): Promise<void> {
    try {
      await this.seasonRepo.deleteSeason(id);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('A season with this slug already exists', 409);
        case 'P2025':
          throw new AppError('Season not found', 404);
      }
    }

    throw error;
  }
}
