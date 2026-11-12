import { ContentStatus, Prisma, type Trip } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { sortPublishedTrips } from '../../utils/common/trip-publication.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateTripRecord, ITripRepository } from './trip.interface.js';
import type { UpdateTripDTO } from './trip.schema.js';

export class TripRepository implements ITripRepository {
  async publishSelected(ids: string[]) {
    return prisma.$transaction(async (transaction) => {
      const where = {
        id: { in: ids },
        status: { in: [ContentStatus.DRAFT, ContentStatus.ARCHIVED] },
      };
      const existingDates = await transaction.trip.updateMany({
        where: { ...where, publishedAt: { not: null } },
        data: { status: ContentStatus.PUBLISHED },
      });
      const firstPublished = await transaction.trip.updateMany({
        where: { ...where, publishedAt: null },
        data: { status: ContentStatus.PUBLISHED, publishedAt: new Date() },
      });
      return { updatedCount: existingDates.count + firstPublished.count };
    });
  }

  async deleteSelected(ids: string[]) {
    return prisma.$transaction(async (transaction) => {
      const trips = await transaction.trip.findMany({
        where: { id: { in: ids } },
        include: { images: true },
      });
      if (trips.length) {
        await transaction.trip.deleteMany({
          where: { id: { in: trips.map(({ id }) => id) } },
        });
      }
      return trips;
    });
  }

  async createTrip(data: CreateTripRecord, adminId: string) {
    const { seasonIds, descriptionRich, ...fields } = data;
    return prisma.trip.create({
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

  async findTrips(): Promise<Omit<Trip, 'descriptionRich'>[]> {
    return prisma.trip.findMany({
      omit: { descriptionRich: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findTripById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        seasons: { include: { season: true } },
        itineraries: { orderBy: { dayNumber: 'asc' } },
        images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] },
      },
    });
  }

  async findPublishedTrips() {
    const trips = await prisma.trip.findMany({
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

  async findPublishedTripBySlug(slug: string) {
    return prisma.trip.findUnique({
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

  async updateTrip(
    id: string,
    data: UpdateTripDTO & { coverImagePublicId?: string | null },
    coverImagePublicId?: string | null,
  ) {
    const where = coverImagePublicId === undefined ? { id } : { id, coverImagePublicId };
    const { seasonIds, descriptionRich, ...fields } = data;
    return prisma.trip.update({
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
                  where: { tripId_seasonId: { tripId: id, seasonId } },
                  create: { seasonId },
                })),
              },
      },
      include: { seasons: { include: { season: true } } },
    });
  }

  async deleteTrip(id: string) {
    return prisma.trip.delete({ where: { id }, include: { images: true } });
  }

  async createGalleryImages(tripId: string, images: CreateGalleryImageDTO[]) {
    return prisma.$transaction(
      images.map((image) => prisma.tripImage.create({ data: { ...image, tripId } })),
    );
  }

  async updateGalleryImage(tripId: string, id: string, data: UpdateGalleryImageDTO) {
    return prisma.tripImage.update({ where: { id, tripId }, data });
  }

  async deleteGalleryImage(tripId: string, id: string) {
    return prisma.tripImage.delete({ where: { id, tripId } });
  }

  async createItinerary(tripId: string, data: CreateItineraryDTO) {
    const { descriptionRich, ...fields } = data;
    return prisma.tripItinerary.create({
      data: {
        ...fields,
        tripId,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
      },
    });
  }

  async updateItinerary(tripId: string, id: string, data: UpdateItineraryDTO) {
    const { descriptionRich, ...fields } = data;
    return prisma.tripItinerary.update({
      where: { id, tripId },
      data: {
        ...fields,
        descriptionRich: descriptionRich === null ? Prisma.DbNull : descriptionRich,
      },
    });
  }

  async deleteItinerary(tripId: string, id: string): Promise<void> {
    await prisma.tripItinerary.delete({ where: { id, tripId } });
  }
}
