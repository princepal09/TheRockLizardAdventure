import { Prisma } from '../../../generated/prisma/client.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { IRegionRepository } from './region.interface.js';
import type { CreateRegionDTO, UpdateRegionDTO } from './region.schema.js';

export class RegionService {
  constructor(private readonly regionRepo: IRegionRepository) {}

  async createRegion(data: CreateRegionDTO, file?: Express.Multer.File) {
    const image = file ? await uploadToCloudinary(file, 'rocklizard/regions') : undefined;

    try {
      return await this.regionRepo.createRegion(
        image ? { ...data, imageUrl: image.secure_url, imagePublicId: image.public_id } : data,
      );
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      this.handleWriteError(error);
    }
  }

  async getRegions() {
    return this.regionRepo.findRegions();
  }

  async getRegion(id: string) {
    const region = await this.regionRepo.findRegionById(id);

    if (!region) {
      throw new AppError('Region not found', 404);
    }

    return region;
  }

  async updateRegion(id: string, data: UpdateRegionDTO, file?: Express.Multer.File) {
    if (!file && Object.keys(data).length === 0) {
      throw new AppError('Provide at least one field to update', 400);
    }

    const current = file || data.imageUrl !== undefined ? await this.getRegion(id) : undefined;
    const image = file ? await uploadToCloudinary(file, 'rocklizard/regions') : undefined;
    const replacingImage = current && (image || data.imageUrl !== current.imageUrl);
    const changes = replacingImage
      ? {
          ...data,
          imageUrl: image?.secure_url ?? data.imageUrl,
          imagePublicId: image?.public_id ?? null,
        }
      : data;

    try {
      const region = await this.regionRepo.updateRegion(id, changes, current?.imagePublicId);
      if (replacingImage) await this.cleanupImage(current.imagePublicId);
      return region;
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      if (
        current &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        await this.getRegion(id);
        throw new AppError('Region image changed. Retry the update', 409);
      }
      this.handleWriteError(error);
    }
  }

  async deleteRegion(id: string): Promise<void> {
    try {
      const region = await this.regionRepo.deleteRegion(id);
      await this.cleanupImage(region.imagePublicId);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  private async cleanupImage(publicId?: string | null): Promise<void> {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete region image from Cloudinary');
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('A region with this slug already exists', 409);
        case 'P2003':
          throw new AppError('Region is linked to a trek or expedition', 409);
        case 'P2025':
          throw new AppError('Region not found', 404);
      }
    }

    throw error;
  }
}
