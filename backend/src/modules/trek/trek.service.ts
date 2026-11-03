import { Prisma } from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import { createWithSlug } from '../../utils/common/create-with-slug.js';
import type { ITrekRepository } from './trek.interface.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

export class TrekService {
  constructor(private readonly trekRepo: ITrekRepository) {}

  async createTrek(data: CreateTrekDTO, adminId: string, file?: Express.Multer.File) {
    const image = file ? await uploadToCloudinary(file, 'rocklizard/treks') : undefined;
    const fields = image
      ? { ...data, coverImageUrl: image.secure_url, coverImagePublicId: image.public_id }
      : data;

    try {
      return await createWithSlug(data.name, 'trek', 200, (slug) =>
        this.trekRepo.createTrek({ ...fields, slug }, adminId),
      );
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      this.handleWriteError(error);
    }
  }

  async getTreks() {
    return this.trekRepo.findTreks();
  }

  async getTrek(id: string) {
    const trek = await this.trekRepo.findTrekById(id);

    if (!trek) {
      throw new AppError('Trek not found', 404);
    }

    return trek;
  }

  async getPublishedTreks() {
    return this.trekRepo.findPublishedTreks();
  }

  async getPublishedTrek(slug: string) {
    const trek = await this.trekRepo.findPublishedTrekBySlug(slug);

    if (!trek) {
      throw new AppError('Trek not found', 404);
    }

    return trek;
  }

  async updateTrek(id: string, data: UpdateTrekDTO, file?: Express.Multer.File) {
    if (!file && Object.keys(data).length === 0) {
      throw new AppError('Provide at least one field to update', 400);
    }

    const current = file || data.coverImageUrl !== undefined ? await this.getTrek(id) : undefined;
    const image = file ? await uploadToCloudinary(file, 'rocklizard/treks') : undefined;
    const replacingImage = current && (image || data.coverImageUrl !== current.coverImageUrl);
    const changes = replacingImage
      ? {
          ...data,
          coverImageUrl: image?.secure_url ?? data.coverImageUrl,
          coverImagePublicId: image?.public_id ?? null,
        }
      : data;

    try {
      const trek = await this.trekRepo.updateTrek(id, changes, current?.coverImagePublicId);
      if (replacingImage) await this.cleanupImage(current.coverImagePublicId);
      return trek;
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      if (
        current &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        await this.getTrek(id);
        throw new AppError('Trek cover image changed. Retry the update', 409);
      }
      this.handleWriteError(error);
    }
  }

  async deleteTrek(id: string): Promise<void> {
    try {
      const trek = await this.trekRepo.deleteTrek(id);
      await this.cleanupImage(trek.coverImagePublicId);
      await Promise.all(trek.images.map((image) => this.cleanupImage(image.imagePublicId)));
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async createItinerary(trekId: string, data: CreateItineraryDTO) {
    try {
      return await this.trekRepo.createItinerary(trekId, data);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  async updateItinerary(trekId: string, id: string, data: UpdateItineraryDTO) {
    try {
      return await this.trekRepo.updateItinerary(trekId, id, data);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  async deleteItinerary(trekId: string, id: string): Promise<void> {
    try {
      await this.trekRepo.deleteItinerary(trekId, id);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  private handleItineraryError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('An itinerary already exists for this day', 409);
        case 'P2003':
          throw new AppError('Trek not found', 404);
        case 'P2025':
          throw new AppError('Itinerary day not found', 404);
      }
    }

    throw error;
  }

  async createGalleryImages(trekId: string, files: Express.Multer.File[]) {
    if (files.length === 0 || files.length > 5) {
      throw new AppError('Upload between 1 and 5 photos', 400);
    }

    await this.getTrek(trekId);
    const images: CreateGalleryImageDTO[] = [];

    try {
      for (const file of files) {
        const image = await uploadToCloudinary(file, 'rocklizard/treks/gallery');
        images.push({ imageUrl: image.secure_url, imagePublicId: image.public_id });
      }

      return await this.trekRepo.createGalleryImages(trekId, images);
    } catch (error) {
      await Promise.all(images.map((image) => this.cleanupImage(image.imagePublicId)));
      this.handleGalleryError(error);
    }
  }

  async updateGalleryImage(trekId: string, id: string, data: UpdateGalleryImageDTO) {
    try {
      return await this.trekRepo.updateGalleryImage(trekId, id, data);
    } catch (error) {
      this.handleGalleryError(error);
    }
  }

  async deleteGalleryImage(trekId: string, id: string): Promise<void> {
    try {
      const image = await this.trekRepo.deleteGalleryImage(trekId, id);
      await this.cleanupImage(image.imagePublicId);
    } catch (error) {
      this.handleGalleryError(error);
    }
  }

  private handleGalleryError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003':
          throw new AppError('Trek not found', 404);
        case 'P2025':
          throw new AppError('Gallery image not found', 404);
      }
    }

    throw error;
  }

  private async cleanupImage(publicId?: string | null): Promise<void> {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete trek cover image from Cloudinary');
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('A trek with this slug already exists', 409);
        case 'P2003':
          throw new AppError('The operation references a missing or linked record', 409);
        case 'P2025':
          throw new AppError('Trek not found', 404);
      }
    }

    throw error;
  }
}
