import { ContentStatus, type Trek } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateTrekRecord, ITrekRepository } from './trek.interface.js';
import type { UpdateTrekDTO } from './trek.schema.js';

export class TrekRepository implements ITrekRepository {
  async createTrek(data: CreateTrekRecord, adminId: string) {
    const { seasonIds, ...fields } = data;
    return prisma.trek.create({
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

  async findTreks(): Promise<Trek[]> {
    return prisma.trek.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] });
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
    return prisma.trek.findMany({
      where: { status: ContentStatus.PUBLISHED },
      omit: { createdBy: true },
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
    const { seasonIds, ...fields } = data;
    return prisma.trek.update({
      where,
      data: {
        ...fields,
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
    return prisma.trekItinerary.create({ data: { ...data, trekId } });
  }

  async updateItinerary(trekId: string, id: string, data: UpdateItineraryDTO) {
    return prisma.trekItinerary.update({ where: { id, trekId }, data });
  }

  async deleteItinerary(trekId: string, id: string): Promise<void> {
    await prisma.trekItinerary.delete({ where: { id, trekId } });
  }
}
