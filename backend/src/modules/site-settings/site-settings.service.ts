import { Prisma } from '../../../generated/prisma/client.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { ISiteSettingsRepository } from './site-settings.interface.js';
import type { UpdateSiteSettingsDTO } from './site-settings.schema.js';

export class SiteSettingsService {
  constructor(private readonly settingsRepo: ISiteSettingsRepository) {}

  async getSettings() {
    const settings = await this.settingsRepo.findSettings();
    if (!settings) return null;

    const { logoPublicId, heroImagePublicId, ...publicSettings } = settings;
    return publicSettings;
  }

  async updateSettings(
    data: UpdateSiteSettingsDTO,
    logo?: Express.Multer.File,
    heroImage?: Express.Multer.File,
  ) {
    if (!logo && !heroImage && Object.keys(data).length === 0) {
      throw new AppError('Provide at least one setting to update', 400);
    }

    const current =
      (await this.settingsRepo.findSettings()) ?? (await this.settingsRepo.createSettings());
    const uploads: string[] = [];
    const previousImages: { logoPublicId?: string | null; heroImagePublicId?: string | null } = {};
    const changes: UpdateSiteSettingsDTO & typeof previousImages = { ...data };
    if (!logo && data.logoUrl === current.logoUrl) delete changes.logoUrl;
    if (!heroImage && data.heroImageUrl === current.heroImageUrl) delete changes.heroImageUrl;

    try {
      if (logo || (data.logoUrl !== undefined && data.logoUrl !== current.logoUrl)) {
        const image = logo ? await uploadToCloudinary(logo, 'rocklizard/site-settings') : undefined;
        if (image) uploads.push(image.public_id);
        changes.logoUrl = image?.secure_url ?? data.logoUrl;
        changes.logoPublicId = image?.public_id ?? null;
        previousImages.logoPublicId = current.logoPublicId;
      }

      if (
        heroImage ||
        (data.heroImageUrl !== undefined && data.heroImageUrl !== current.heroImageUrl)
      ) {
        const image = heroImage
          ? await uploadToCloudinary(heroImage, 'rocklizard/site-settings')
          : undefined;
        if (image) uploads.push(image.public_id);
        changes.heroImageUrl = image?.secure_url ?? data.heroImageUrl;
        changes.heroImagePublicId = image?.public_id ?? null;
        previousImages.heroImagePublicId = current.heroImagePublicId;
      }

      const settings = await this.settingsRepo.updateSettings(current.id, changes, previousImages);
      await Promise.all(
        Object.values(previousImages)
          .filter(
            (publicId) =>
              publicId !== settings.logoPublicId && publicId !== settings.heroImagePublicId,
          )
          .map((publicId) => this.cleanupImage(publicId)),
      );
      return settings;
    } catch (error) {
      await Promise.all(uploads.map((publicId) => this.cleanupImage(publicId)));
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError('Site settings changed. Retry the update', 409);
      }
      throw error;
    }
  }

  private async cleanupImage(publicId?: string | null): Promise<void> {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete site settings image from Cloudinary');
    }
  }
}
