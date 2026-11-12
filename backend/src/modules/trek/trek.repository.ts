import { ContentStatus, Prisma, type Trek } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { sortPublishedTrips } from '../../utils/common/trip-publication.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateTrekRecord, ITrekRepository } from './trek.interface.js';
import type { UpdateTrekDTO } from './trek.schema.js';

export class TrekRepository implements ITrekRepository {
  async publishSelected(ids: string[]) {
    return prisma.$transaction(async (transaction) => {
      const where = {
        id: { in: ids },
        status: { in: [ContentStatus.DRAFT, ContentStatus.ARCHIVED] },
      };
      const existingDates = await transaction.trek.updateMany({
        where: { ...where, publishedAt: { not: null } },
        data: { status: ContentStatus.PUBLISHED },
      });
      const firstPublished = await transaction.trek.updateMany({
        where: { ...where, publishedAt: null },
        data: { status: ContentStatus.PUBLISHED, publishedAt: new Date() },
      });
      return { updatedCount: existingDates.count + firstPublished.count };
    });
  }

  async deleteSelected(ids: string[]) {
    return prisma.$transaction(async (transaction) => {
      const trips = await transaction.trek.findMany({
        where: { id: { in: ids } },
        include: { images: true },
      });
      if (trips.length) {
        await transaction.trek.deleteMany({ where: { id: { in: trips.map(({ id }) => id) } } });
      }
      return trips;
    });
  }

  async createTrek(data: CreateTrekRecord, adminId: string) {
    const { seasonIds, descriptionRich, ...fields } = data;
    return prisma.trek.create({
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

  async findTreks(): Promise<Omit<Trek, 'descriptionRich'>[]> {
    return prisma.trek.findMany({
      omit: { descriptionRich: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findTrekById(id: string) {
    return prisma.trek.findUnique({
      where: { id },
      include: {
        seasons: { include: { season: true } },
        itineraries: { orderBy: { dayNumber: 'asc' } },
        images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] },
      },
    });
  }

  async findPublishedTreks() {
    const trips = await prisma.trek.findMany({
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
        months: { select: { month: true } },
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

  async findPublishedTrekBySlug(slug: string) {
    return prisma.trek.findUnique({
      where: { slug, status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
      include: {
        region: { select: { name: true } },
        months: { select: { month: true }, orderBy: { month: 'asc' } },
        seasons: { where: { season: { isActive: true } }, include: { season: true } },
        itineraries: { orderBy: { dayNumber: 'asc' } },
        images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] },
      },
    });
  }

  async updateTrek(
    id: string,
    data: UpdateTrekDTO & { coverImagePublicId?: string | null },
    coverImagePublicId?: string | null,
  ) {
    const where = coverImagePublicId === undefined ? { id } : { id, coverImagePublicId };
    const { seasonIds, descriptionRich, ...fields } = data;
    return prisma.trek.update({
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
                  where: { trekId_seasonId: { trekId: id, seasonId } },
                  create: { seasonId },
                })),
              },
      },
      include: { seasons: { include: { season: true } } },
    });
  }

  async deleteTrek(id: string) {
    return prisma.trek.delete({ where: { id }, include: { images: true } });
  }

  async createGalleryImages(trekId: string, images: CreateGalleryImageDTO[]) {
    return prisma.$transaction(
      images.map((image) => prisma.trekImage.create({ data: { ...image, trekId } })),
    );
  }

  async updateGalleryImage(trekId: string, id: string, data: UpdateGalleryImageDTO) {
    return prisma.trekImage.update({ where: { id, trekId }, data });
  }

  async deleteGalleryImage(trekId: string, id: string) {
    return prisma.trekImage.delete({ where: { id, trekId } });
  }

  async createItinerary(trekId: string, data: CreateItineraryDTO) {
    const { descriptionRich, ...fields } = data;
    return prisma.trekItinerary.create({
      data: {
        ...fields,
        trekId,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
      },
    });
  }

  async updateItinerary(trekId: string, id: string, data: UpdateItineraryDTO) {
    const { descriptionRich, ...fields } = data;
    return prisma.trekItinerary.update({
      where: { id, trekId },
      data: {
        ...fields,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
      },
    });
  }

  async deleteItinerary(trekId: string, id: string): Promise<void> {
    await prisma.trekItinerary.delete({ where: { id, trekId } });
  }
}
