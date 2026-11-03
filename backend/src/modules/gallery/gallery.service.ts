import { Prisma } from '../../../generated/prisma/client.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { IGalleryRepository } from './gallery.interface.js';
import type { CreateGalleryImageDTO, UpdateSiteGalleryImageDTO } from './gallery.schema.js';

export class GalleryService {
  constructor(private readonly galleryRepo: IGalleryRepository) {}

  async getActiveImages() {
    const images = await this.galleryRepo.findImages(true);
    return images.map(({ imagePublicId, ...image }) => image);
  }

  async getImages() {
    return this.galleryRepo.findImages();
  }

  async createImages(files: Express.Multer.File[]) {
    if (files.length === 0 || files.length > 5) {
      throw new AppError('Upload between 1 and 5 photos', 400);
    }

    const images: CreateGalleryImageDTO[] = [];

    try {
      for (const file of files) {
        const image = await uploadToCloudinary(file, 'rocklizard/gallery');
        images.push({ imageUrl: image.secure_url, imagePublicId: image.public_id });
      }

      return await this.galleryRepo.createImages(images);
    } catch (error) {
      await Promise.all(images.map((image) => this.cleanupImage(image.imagePublicId)));
      throw error;
    }
  }

  async updateImage(id: string, data: UpdateSiteGalleryImageDTO) {
    try {
      return await this.galleryRepo.updateImage(id, data);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const image = await this.galleryRepo.deleteImage(id);
      await this.cleanupImage(image.imagePublicId);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  private async cleanupImage(publicId?: string | null): Promise<void> {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete site gallery image from Cloudinary');
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Gallery image not found', 404);
    }

    throw error;
  }
}
