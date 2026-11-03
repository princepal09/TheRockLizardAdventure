import type { Gallery } from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateSiteGalleryImageDTO } from './gallery.schema.js';

export interface IGalleryRepository {
  findImages(isActive?: boolean): Promise<Gallery[]>;
  createImages(images: CreateGalleryImageDTO[]): Promise<Gallery[]>;
  updateImage(id: string, data: UpdateSiteGalleryImageDTO): Promise<Gallery>;
  deleteImage(id: string): Promise<Gallery>;
}
