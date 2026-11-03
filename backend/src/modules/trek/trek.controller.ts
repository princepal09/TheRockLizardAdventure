import type { Request, Response } from 'express';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { trekIdSchema, trekSlugSchema } from './trek.schema.js';
import type { TrekService } from './trek.service.js';

export class TrekController {
  constructor(private readonly trekService: TrekService) {}

  createTrekController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    const trek = await this.trekService.createTrek(req.body, adminId, req.file);

    sendResponse(res, 201, { success: true, message: 'Trek created successfully', data: trek });
  });

  getTreksController = catchAsync(async (_req: Request, res: Response) => {
    const treks = await this.trekService.getTreks();

    sendResponse(res, 200, { success: true, message: 'Treks fetched successfully', data: treks });
  });

  getTrekController = catchAsync(async (req: Request, res: Response) => {
    const trek = await this.trekService.getTrek(this.parseTrekId(req.params.trekId));

    sendResponse(res, 200, { success: true, message: 'Trek fetched successfully', data: trek });
  });

  getPublishedTreksController = catchAsync(async (_req: Request, res: Response) => {
    const treks = await this.trekService.getPublishedTreks();

    sendResponse(res, 200, { success: true, message: 'Treks fetched successfully', data: treks });
  });

  getPublishedTrekController = catchAsync(async (req: Request, res: Response) => {
    const slug = trekSlugSchema.safeParse(req.params.slug);
    if (!slug.success) {
      throw new AppError('Invalid trek slug', 400);
    }

    const trek = await this.trekService.getPublishedTrek(slug.data);

    sendResponse(res, 200, { success: true, message: 'Trek fetched successfully', data: trek });
  });

  updateTrekController = catchAsync(async (req: Request, res: Response) => {
    const trek = await this.trekService.updateTrek(
      this.parseTrekId(req.params.trekId),
      req.body,
      req.file,
    );

    sendResponse(res, 200, { success: true, message: 'Trek updated successfully', data: trek });
  });

  deleteTrekController = catchAsync(async (req: Request, res: Response) => {
    await this.trekService.deleteTrek(this.parseTrekId(req.params.trekId));

    sendResponse(res, 200, { success: true, message: 'Trek deleted successfully' });
  });

  private parseTrekId(value: unknown): string {
    const result = trekIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid trek ID', 400);
    }

    return result.data;
  }
}
