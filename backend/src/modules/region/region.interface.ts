import type { Region } from '../../../generated/prisma/client.js';
import type { CreateRegionDTO, UpdateRegionDTO } from './region.schema.js';

type RegionImage = Pick<Region, 'imagePublicId'>;

export interface IRegionRepository {
  createRegion(data: CreateRegionDTO & Partial<RegionImage>): Promise<Region>;
  findRegions(): Promise<Region[]>;
  findRegionById(id: string): Promise<Region | null>;
  updateRegion(
    id: string,
    data: UpdateRegionDTO & Partial<RegionImage>,
    imagePublicId?: string | null,
  ): Promise<Region>;
  deleteRegion(id: string): Promise<Region>;
}
