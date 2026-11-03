import { ContentStatus, type Expedition } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateExpeditionRecord, IExpeditionRepository } from './expedition.interface.js';
import type { UpdateExpeditionDTO } from './expedition.schema.js';

export class ExpeditionRepository implements IExpeditionRepository {
  async createExpedition(data: CreateExpeditionRecord, adminId: string) {
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
      include: {
        seasons: { include: { season: true } },
        itineraries: { orderBy: { dayNumber: 'asc' } },
        images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] },
      },
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
      include: {
        seasons: { where: { season: { isActive: true } }, include: { season: true } },
        itineraries: { orderBy: { dayNumber: 'asc' } },
        images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] },
      },
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

  async deleteExpedition(id: string) {
    return prisma.expedition.delete({ where: { id }, include: { images: true } });
  }

  async createGalleryImages(expeditionId: string, images: CreateGalleryImageDTO[]) {
    return prisma.$transaction(
      images.map((image) => prisma.expeditionImage.create({ data: { ...image, expeditionId } })),
    );
  }

  async updateGalleryImage(expeditionId: string, id: string, data: UpdateGalleryImageDTO) {
    return prisma.expeditionImage.update({ where: { id, expeditionId }, data });
  }

  async deleteGalleryImage(expeditionId: string, id: string) {
    return prisma.expeditionImage.delete({ where: { id, expeditionId } });
  }

  async createItinerary(expeditionId: string, data: CreateItineraryDTO) {
    return prisma.expeditionItinerary.create({ data: { ...data, expeditionId } });
  }

  async updateItinerary(expeditionId: string, id: string, data: UpdateItineraryDTO) {
    return prisma.expeditionItinerary.update({ where: { id, expeditionId }, data });
  }

  async deleteItinerary(expeditionId: string, id: string): Promise<void> {
    await prisma.expeditionItinerary.delete({ where: { id, expeditionId } });
  }
}
