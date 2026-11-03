import { Prisma } from '../../../generated/prisma/client.js';
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

    const current = file || data.coverImageUrl !== undefined ? await this.getExpedition(id) : undefined;
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
      const expedition = await this.expeditionRepo.updateExpedition(id, changes, current?.coverImagePublicId);
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
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  private async cleanupImage(publicId?: string | null): Promise<void> {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete expedition cover image from Cloudinary');
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
