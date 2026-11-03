import type { Trek } from '../../../generated/prisma/client.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

type TrekCover = Partial<Pick<Trek, 'coverImagePublicId'>>;

export interface ITrekRepository {
  createTrek(data: CreateTrekDTO & TrekCover, adminId: string): Promise<Trek>;
  findTreks(): Promise<Trek[]>;
  findTrekById(id: string): Promise<Trek | null>;
  findPublishedTreks(): Promise<Omit<Trek, 'createdBy'>[]>;
  findPublishedTrekBySlug(slug: string): Promise<Omit<Trek, 'createdBy'> | null>;
  updateTrek(
    id: string,
    data: UpdateTrekDTO & TrekCover,
    coverImagePublicId?: string | null,
  ): Promise<Trek>;
  deleteTrek(id: string): Promise<Trek>;
}
