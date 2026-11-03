import type { Trek, Season } from '../../../generated/prisma/client.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

type TrekCover = Partial<Pick<Trek, 'coverImagePublicId'>>;
type TrekSeasons = { seasons: { seasonId: string; season: Season }[] };

export interface ITrekRepository {
  createTrek(data: CreateTrekDTO & TrekCover, adminId: string): Promise<Trek & TrekSeasons>;
  findTreks(): Promise<Trek[]>;
  findTrekById(id: string): Promise<(Trek & TrekSeasons) | null>;
  findPublishedTreks(): Promise<Omit<Trek, 'createdBy'>[]>;
  findPublishedTrekBySlug(slug: string): Promise<(Omit<Trek, 'createdBy'> & TrekSeasons) | null>;
  updateTrek(
    id: string,
    data: UpdateTrekDTO & TrekCover,
    coverImagePublicId?: string | null,
  ): Promise<Trek & TrekSeasons>;
  deleteTrek(id: string): Promise<Trek>;
}
