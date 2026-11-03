import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import type { DashboardRepository } from './dashboard.repository.js';

export class DashboardController {
  constructor(private readonly dashboardRepo: DashboardRepository) {}

  getSummaryController = catchAsync(async (_req: Request, res: Response) => {
    const summary = await this.dashboardRepo.getSummary();

    res.setHeader('Cache-Control', 'no-store');
    sendResponse(res, 200, {
      success: true,
      message: 'Dashboard summary fetched successfully',
      data: summary,
    });
  });
}
