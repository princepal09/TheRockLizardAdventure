import type { Request, Response } from 'express';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { regionIdSchema } from './region.schema.js';
import type { RegionService } from './region.service.js';

export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  createRegionController = catchAsync(async (req: Request, res: Response) => {
    const region = await this.regionService.createRegion(req.body, req.file);

    sendResponse(res, 201, { success: true, message: 'Region created successfully', data: region });
  });

  getRegionsController = catchAsync(async (_req: Request, res: Response) => {
    const regions = await this.regionService.getRegions();

    sendResponse(res, 200, {
      success: true,
      message: 'Regions fetched successfully',
      data: regions,
    });
  });

  getRegionController = catchAsync(async (req: Request, res: Response) => {
    const region = await this.regionService.getRegion(this.parseRegionId(req.params.regionId));

    sendResponse(res, 200, { success: true, message: 'Region fetched successfully', data: region });
  });

  updateRegionController = catchAsync(async (req: Request, res: Response) => {
    const region = await this.regionService.updateRegion(
      this.parseRegionId(req.params.regionId),
      req.body,
      req.file,
    );

    sendResponse(res, 200, { success: true, message: 'Region updated successfully', data: region });
  });

  deleteRegionController = catchAsync(async (req: Request, res: Response) => {
    await this.regionService.deleteRegion(this.parseRegionId(req.params.regionId));

    sendResponse(res, 200, { success: true, message: 'Region deleted successfully' });
  });

  private parseRegionId(value: unknown): string {
    const result = regionIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid region ID', 400);
    }

    return result.data;
  }
}
