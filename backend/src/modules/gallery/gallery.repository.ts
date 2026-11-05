import { prisma } from '../../lib/prisma.js';
import type { IGalleryRepository } from './gallery.interface.js';
import type { CreateGalleryImageDTO, UpdateSiteGalleryImageDTO } from './gallery.schema.js';

export class GalleryRepository implements IGalleryRepository {
  async findImages(isActive?: boolean) {
    return prisma.gallery.findMany({
      where: { isActive },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  async createImages(images: CreateGalleryImageDTO[]) {
    return prisma.$transaction(images.map((data) => prisma.gallery.create({ data })));
  }

  async updateImage(id: string, data: UpdateSiteGalleryImageDTO) {
    return prisma.gallery.update({ where: { id }, data });
  }

  async deleteImage(id: string) {
    return prisma.gallery.delete({ where: { id } });
  }

  async deleteAllImages() {
    return prisma.$transaction(async (transaction) => {
      const images = await transaction.gallery.findMany({
        select: { id: true, imagePublicId: true },
      });
      if (images.length) {
        // Delete this snapshot only, preserving uploads made concurrently.
        await transaction.gallery.deleteMany({
          where: { id: { in: images.map(({ id }) => id) } },
        });
      }
      return images;
    });
  }
}
