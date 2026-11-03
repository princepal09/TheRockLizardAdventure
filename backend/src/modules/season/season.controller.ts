import type { Request, Response } from 'express';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { seasonIdSchema } from './season.schema.js';
import type { SeasonService } from './season.service.js';

export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  createSeasonController = catchAsync(async (req: Request, res: Response) => {
    const season = await this.seasonService.createSeason(req.body);

    sendResponse(res, 201, { success: true, message: 'Season created successfully', data: season });
  });

  getSeasonsController = catchAsync(async (_req: Request, res: Response) => {
    const seasons = await this.seasonService.getSeasons();

    sendResponse(res, 200, {
      success: true,
      message: 'Seasons fetched successfully',
      data: seasons,
    });
  });

  getActiveSeasonsController = catchAsync(async (_req: Request, res: Response) => {
    const seasons = await this.seasonService.getActiveSeasons();

    sendResponse(res, 200, {
      success: true,
      message: 'Seasons fetched successfully',
      data: seasons,
    });
  });

  getSeasonController = catchAsync(async (req: Request, res: Response) => {
    const season = await this.seasonService.getSeason(this.parseSeasonId(req.params.seasonId));

    sendResponse(res, 200, { success: true, message: 'Season fetched successfully', data: season });
  });

  updateSeasonController = catchAsync(async (req: Request, res: Response) => {
    const season = await this.seasonService.updateSeason(
      this.parseSeasonId(req.params.seasonId),
      req.body,
    );

    sendResponse(res, 200, { success: true, message: 'Season updated successfully', data: season });
  });

  deleteSeasonController = catchAsync(async (req: Request, res: Response) => {
    await this.seasonService.deleteSeason(this.parseSeasonId(req.params.seasonId));

    sendResponse(res, 200, { success: true, message: 'Season deleted successfully' });
  });

  private parseSeasonId(value: unknown): string {
    const result = seasonIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid season ID', 400);
    }

    return result.data;
  }
}
