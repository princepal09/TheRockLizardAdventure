import { Prisma } from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { IExpeditionRepository } from './expedition.interface.js';
import type { CreateExpeditionDTO, UpdateExpeditionDTO } from './expedition.schema.js';

export class ExpeditionService {
  constructor(private readonly expeditionRepo: IExpeditionRepository) {}

  async createExpedition(data: CreateExpeditionDTO, adminId: string, file?: Express.Multer.File) {
    const image = file ? await uploadToCloudinary(file, 'rocklizard/expeditions') : undefined;

    try {
      return await this.expeditionRepo.createExpedition(
        image
          ? { ...data, coverImageUrl: image.secure_url, coverImagePublicId: image.public_id }
          : data,
        adminId,
      );
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      this.handleWriteError(error);
    }
  }

  async getExpeditions() {
    return this.expeditionRepo.findExpeditions();
  }

  async getExpedition(id: string) {
    const expedition = await this.expeditionRepo.findExpeditionById(id);

    if (!expedition) {
      throw new AppError('Expedition not found', 404);
    }

    return expedition;
  }

  async getPublishedExpeditions() {
    return this.expeditionRepo.findPublishedExpeditions();
  }

  async getPublishedExpedition(slug: string) {
    const expedition = await this.expeditionRepo.findPublishedExpeditionBySlug(slug);

    if (!expedition) {
      throw new AppError('Expedition not found', 404);
    }

    return expedition;
  }

  async updateExpedition(id: string, data: UpdateExpeditionDTO, file?: Express.Multer.File) {
    if (!file && Object.keys(data).length === 0) {
      throw new AppError('Provide at least one field to update', 400);
    }

    const current =
      file || data.coverImageUrl !== undefined ? await this.getExpedition(id) : undefined;
    const image = file ? await uploadToCloudinary(file, 'rocklizard/expeditions') : undefined;
    const replacingImage = current && (image || data.coverImageUrl !== current.coverImageUrl);
    const changes = replacingImage
      ? {
          ...data,
          coverImageUrl: image?.secure_url ?? data.coverImageUrl,
          coverImagePublicId: image?.public_id ?? null,
        }
      : data;

    try {
      const expedition = await this.expeditionRepo.updateExpedition(
        id,
        changes,
        current?.coverImagePublicId,
      );
      if (replacingImage) await this.cleanupImage(current.coverImagePublicId);
      return expedition;
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      if (
        current &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        await this.getExpedition(id);
        throw new AppError('Expedition cover image changed. Retry the update', 409);
      }
      this.handleWriteError(error);
    }
  }

  async deleteExpedition(id: string): Promise<void> {
    try {
      const expedition = await this.expeditionRepo.deleteExpedition(id);
      await this.cleanupImage(expedition.coverImagePublicId);
      await Promise.all(expedition.images.map((image) => this.cleanupImage(image.imagePublicId)));
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async createItinerary(expeditionId: string, data: CreateItineraryDTO) {
    try {
      return await this.expeditionRepo.createItinerary(expeditionId, data);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  async updateItinerary(expeditionId: string, id: string, data: UpdateItineraryDTO) {
    try {
      return await this.expeditionRepo.updateItinerary(expeditionId, id, data);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  async deleteItinerary(expeditionId: string, id: string): Promise<void> {
    try {
      await this.expeditionRepo.deleteItinerary(expeditionId, id);
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
          throw new AppError('Expedition not found', 404);
        case 'P2025':
          throw new AppError('Itinerary day not found', 404);
      }
    }

    throw error;
  }

  async createGalleryImages(expeditionId: string, files: Express.Multer.File[]) {
    if (files.length === 0 || files.length > 5) {
      throw new AppError('Upload between 1 and 5 photos', 400);
    }

    await this.getExpedition(expeditionId);
    const images: CreateGalleryImageDTO[] = [];

    try {
      for (const file of files) {
        const image = await uploadToCloudinary(file, 'rocklizard/expeditions/gallery');
        images.push({ imageUrl: image.secure_url, imagePublicId: image.public_id });
      }

      return await this.expeditionRepo.createGalleryImages(expeditionId, images);
    } catch (error) {
      await Promise.all(images.map((image) => this.cleanupImage(image.imagePublicId)));
      this.handleGalleryError(error);
    }
  }

  async updateGalleryImage(expeditionId: string, id: string, data: UpdateGalleryImageDTO) {
    try {
      return await this.expeditionRepo.updateGalleryImage(expeditionId, id, data);
    } catch (error) {
      this.handleGalleryError(error);
    }
  }

  async deleteGalleryImage(expeditionId: string, id: string): Promise<void> {
    try {
      const image = await this.expeditionRepo.deleteGalleryImage(expeditionId, id);
      await this.cleanupImage(image.imagePublicId);
    } catch (error) {
      this.handleGalleryError(error);
    }
  }

  private handleGalleryError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003':
          throw new AppError('Expedition not found', 404);
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
      logger.warn(
        { err: error, publicId },
        'Failed to delete expedition cover image from Cloudinary',
      );
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('A expedition with this slug already exists', 409);
        case 'P2003':
          throw new AppError('The operation references a missing or linked record', 409);
        case 'P2025':
          throw new AppError('Expedition not found', 404);
      }
    }

    throw error;
  }
}
