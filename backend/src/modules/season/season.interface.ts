import type { Season } from '../../../generated/prisma/client.js';
import type { CreateSeasonDTO, UpdateSeasonDTO } from './season.schema.js';

export interface ISeasonRepository {
  createSeason(data: CreateSeasonDTO): Promise<Season>;
  findSeasons(isActive?: boolean): Promise<Season[]>;
  findSeasonById(id: string): Promise<Season | null>;
  updateSeason(id: string, data: UpdateSeasonDTO): Promise<Season>;
  deleteSeason(id: string): Promise<void>;
}
