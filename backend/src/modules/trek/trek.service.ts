import { Prisma } from '../../../generated/prisma/client.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { ITrekRepository } from './trek.interface.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

export class TrekService {
  constructor(private readonly trekRepo: ITrekRepository) {}

  async createTrek(data: CreateTrekDTO, adminId: string, file?: Express.Multer.File) {
    const image = file ? await uploadToCloudinary(file, 'rocklizard/treks') : undefined;

    try {
      return await this.trekRepo.createTrek(
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
    } catch (error) {
      this.handleWriteError(error);
    }
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
