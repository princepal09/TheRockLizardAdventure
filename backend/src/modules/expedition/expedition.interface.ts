import type { Expedition, Season } from '../../../generated/prisma/client.js';
import type { CreateExpeditionDTO, UpdateExpeditionDTO } from './expedition.schema.js';

type ExpeditionCover = Partial<Pick<Expedition, 'coverImagePublicId'>>;
type ExpeditionSeasons = { seasons: { seasonId: string; season: Season }[] };

export interface IExpeditionRepository {
  createExpedition(
    data: CreateExpeditionDTO & ExpeditionCover,
    adminId: string,
  ): Promise<Expedition & ExpeditionSeasons>;
  findExpeditions(): Promise<Expedition[]>;
  findExpeditionById(id: string): Promise<(Expedition & ExpeditionSeasons) | null>;
  findPublishedExpeditions(): Promise<Omit<Expedition, 'createdBy'>[]>;
  findPublishedExpeditionBySlug(
    slug: string,
  ): Promise<(Omit<Expedition, 'createdBy'> & ExpeditionSeasons) | null>;
  updateExpedition(
    id: string,
    data: UpdateExpeditionDTO & ExpeditionCover,
    coverImagePublicId?: string | null,
  ): Promise<Expedition & ExpeditionSeasons>;
  deleteExpedition(id: string): Promise<Expedition>;
}
