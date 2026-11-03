import type { SiteSettings } from '../../../generated/prisma/client.js';
import type { UpdateSiteSettingsDTO } from './site-settings.schema.js';

type ImageIds = Pick<SiteSettings, 'logoPublicId' | 'heroImagePublicId'>;

export interface ISiteSettingsRepository {
  findSettings(): Promise<SiteSettings | null>;
  createSettings(): Promise<SiteSettings>;
  updateSettings(
    id: string,
    data: UpdateSiteSettingsDTO & Partial<ImageIds>,
    previousImages: Partial<ImageIds>,
  ): Promise<SiteSettings>;
}
