import { ContentStatus, Prisma, type Expedition } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { sortPublishedTrips } from '../../utils/common/trip-publication.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateExpeditionRecord, IExpeditionRepository } from './expedition.interface.js';
import type { UpdateExpeditionDTO } from './expedition.schema.js';

export class ExpeditionRepository implements IExpeditionRepository {
  async publishSelected(ids: string[]) {
    return prisma.$transaction(async (transaction) => {
      const where = {
        id: { in: ids },
        status: { in: [ContentStatus.DRAFT, ContentStatus.ARCHIVED] },
      };
      const existingDates = await transaction.expedition.updateMany({
        where: { ...where, publishedAt: { not: null } },
        data: { status: ContentStatus.PUBLISHED },
      });
      const firstPublished = await transaction.expedition.updateMany({
        where: { ...where, publishedAt: null },
        data: { status: ContentStatus.PUBLISHED, publishedAt: new Date() },
      });
      return { updatedCount: existingDates.count + firstPublished.count };
    });
  }

  async deleteSelected(ids: string[]) {
    return prisma.$transaction(async (transaction) => {
      const trips = await transaction.expedition.findMany({
        where: { id: { in: ids } },
        include: { images: true },
      });
      if (trips.length) {
        await transaction.expedition.deleteMany({
          where: { id: { in: trips.map(({ id }) => id) } },
        });
      }
      return trips;
    });
  }

  async createExpedition(data: CreateExpeditionRecord, adminId: string) {
    const { seasonIds, descriptionRich, ...fields } = data;
    return prisma.expedition.create({
      data: {
        ...fields,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
        createdBy: adminId,
        seasons: seasonIds?.length
          ? { create: seasonIds.map((seasonId) => ({ seasonId })) }
          : undefined,
      },
      include: { seasons: { include: { season: true } } },
    });
  }

  async findExpeditions(): Promise<Omit<Expedition, 'descriptionRich'>[]> {
    return prisma.expedition.findMany({
      omit: { descriptionRich: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
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
    const trips = await prisma.expedition.findMany({
      where: { status: ContentStatus.PUBLISHED },
      omit: {
        descriptionRich: true,
        createdBy: true,
        departureDates: true,
        meetingPoint: true,
        inclusions: true,
        exclusions: true,
        requiredGear: true,
        cancellationPolicy: true,
        refundPolicy: true,
      },
      include: {
        region: { select: { name: true } },
        seasons: {
          where: { season: { isActive: true } },
          select: { seasonId: true, season: { select: { name: true } } },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
    return sortPublishedTrips(trips);
  }

  async findPublishedExpeditionBySlug(slug: string) {
    return prisma.expedition.findUnique({
      where: { slug, status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
      include: {
        region: { select: { name: true } },
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
    const { seasonIds, descriptionRich, ...fields } = data;
    return prisma.expedition.update({
      where,
      data: {
        ...fields,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
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
    const { descriptionRich, ...fields } = data;
    return prisma.expeditionItinerary.create({
      data: {
        ...fields,
        expeditionId,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
      },
    });
  }

  async updateItinerary(expeditionId: string, id: string, data: UpdateItineraryDTO) {
    const { descriptionRich, ...fields } = data;
    return prisma.expeditionItinerary.update({
      where: { id, expeditionId },
      data: {
        ...fields,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
      },
    });
  }

  async deleteItinerary(expeditionId: string, id: string): Promise<void> {
    await prisma.expeditionItinerary.delete({ where: { id, expeditionId } });
  }
}
