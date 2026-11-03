import type { Expedition } from '../../../generated/prisma/client.js';
import type { CreateExpeditionDTO, UpdateExpeditionDTO } from './expedition.schema.js';

type ExpeditionCover = Partial<Pick<Expedition, 'coverImagePublicId'>>;

export interface IExpeditionRepository {
  createExpedition(data: CreateExpeditionDTO & ExpeditionCover, adminId: string): Promise<Expedition>;
  findExpeditions(): Promise<Expedition[]>;
  findExpeditionById(id: string): Promise<Expedition | null>;
  findPublishedExpeditions(): Promise<Omit<Expedition, 'createdBy'>[]>;
  findPublishedExpeditionBySlug(slug: string): Promise<Omit<Expedition, 'createdBy'> | null>;
  updateExpedition(
    id: string,
    data: UpdateExpeditionDTO & ExpeditionCover,
    coverImagePublicId?: string | null,
  ): Promise<Expedition>;
  deleteExpedition(id: string): Promise<Expedition>;
}
