import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import type { SiteSettingsService } from './site-settings.service.js';

export class SiteSettingsController {
  constructor(private readonly settingsService: SiteSettingsService) {}

  getSettingsController = catchAsync(async (_req: Request, res: Response) => {
    const settings = await this.settingsService.getSettings();
    sendResponse(res, 200, {
      success: true,
      message: 'Site settings fetched successfully',
      data: settings,
    });
  });

  updateSettingsController = catchAsync(async (req: Request, res: Response) => {
    const files = Array.isArray(req.files) ? undefined : req.files;
    const settings = await this.settingsService.updateSettings(
      req.body,
      files?.logo?.[0],
      files?.heroImage?.[0],
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Site settings updated successfully',
      data: settings,
    });
  });
}
