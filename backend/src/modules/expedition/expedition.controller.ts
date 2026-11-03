import type { Request, Response } from 'express';
import { galleryImageIdSchema } from '../gallery/gallery.schema.js';
import { itineraryIdSchema } from '../itinerary/itinerary.schema.js';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { expeditionIdSchema, expeditionSlugSchema } from './expedition.schema.js';
import type { ExpeditionService } from './expedition.service.js';

export class ExpeditionController {
  constructor(private readonly expeditionService: ExpeditionService) {}

  createExpeditionController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    const expedition = await this.expeditionService.createExpedition(req.body, adminId, req.file);

    sendResponse(res, 201, {
      success: true,
      message: 'Expedition created successfully',
      data: expedition,
    });
  });

  getExpeditionsController = catchAsync(async (_req: Request, res: Response) => {
    const expeditions = await this.expeditionService.getExpeditions();

    sendResponse(res, 200, {
      success: true,
      message: 'Expeditions fetched successfully',
      data: expeditions,
    });
  });

  getExpeditionController = catchAsync(async (req: Request, res: Response) => {
    const expedition = await this.expeditionService.getExpedition(
      this.parseExpeditionId(req.params.expeditionId),
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Expedition fetched successfully',
      data: expedition,
    });
  });

  getPublishedExpeditionsController = catchAsync(async (_req: Request, res: Response) => {
    const expeditions = await this.expeditionService.getPublishedExpeditions();

    sendResponse(res, 200, {
      success: true,
      message: 'Expeditions fetched successfully',
      data: expeditions,
    });
  });

  getPublishedExpeditionController = catchAsync(async (req: Request, res: Response) => {
    const slug = expeditionSlugSchema.safeParse(req.params.slug);
    if (!slug.success) {
      throw new AppError('Invalid expedition slug', 400);
    }

    const expedition = await this.expeditionService.getPublishedExpedition(slug.data);

    sendResponse(res, 200, {
      success: true,
      message: 'Expedition fetched successfully',
      data: expedition,
    });
  });

  updateExpeditionController = catchAsync(async (req: Request, res: Response) => {
    const expedition = await this.expeditionService.updateExpedition(
      this.parseExpeditionId(req.params.expeditionId),
      req.body,
      req.file,
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Expedition updated successfully',
      data: expedition,
    });
  });

  deleteExpeditionController = catchAsync(async (req: Request, res: Response) => {
    await this.expeditionService.deleteExpedition(this.parseExpeditionId(req.params.expeditionId));

    sendResponse(res, 200, { success: true, message: 'Expedition deleted successfully' });
  });

  createItineraryController = catchAsync(async (req: Request, res: Response) => {
    const itinerary = await this.expeditionService.createItinerary(
      this.parseExpeditionId(req.params.expeditionId),
      req.body,
    );

    sendResponse(res, 201, {
      success: true,
      message: 'Itinerary day created successfully',
      data: itinerary,
    });
  });

  updateItineraryController = catchAsync(async (req: Request, res: Response) => {
    const itinerary = await this.expeditionService.updateItinerary(
      this.parseExpeditionId(req.params.expeditionId),
      this.parseItineraryId(req.params.itineraryId),
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Itinerary day updated successfully',
      data: itinerary,
    });
  });

  deleteItineraryController = catchAsync(async (req: Request, res: Response) => {
    await this.expeditionService.deleteItinerary(
      this.parseExpeditionId(req.params.expeditionId),
      this.parseItineraryId(req.params.itineraryId),
    );

    sendResponse(res, 200, { success: true, message: 'Itinerary day deleted successfully' });
  });

  createGalleryImagesController = catchAsync(async (req: Request, res: Response) => {
    const images = await this.expeditionService.createGalleryImages(
      this.parseExpeditionId(req.params.expeditionId),
      Array.isArray(req.files) ? req.files : [],
    );

    sendResponse(res, 201, {
      success: true,
      message: 'Gallery images uploaded successfully',
      data: images,
    });
  });

  updateGalleryImageController = catchAsync(async (req: Request, res: Response) => {
    const image = await this.expeditionService.updateGalleryImage(
      this.parseExpeditionId(req.params.expeditionId),
      this.parseGalleryImageId(req.params.imageId),
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Gallery image updated successfully',
      data: image,
    });
  });

  deleteGalleryImageController = catchAsync(async (req: Request, res: Response) => {
    await this.expeditionService.deleteGalleryImage(
      this.parseExpeditionId(req.params.expeditionId),
      this.parseGalleryImageId(req.params.imageId),
    );

    sendResponse(res, 200, { success: true, message: 'Gallery image deleted successfully' });
  });

  private parseGalleryImageId(value: unknown): string {
    const result = galleryImageIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid gallery image ID', 400);
    }

    return result.data;
  }

  private parseItineraryId(value: unknown): string {
    const result = itineraryIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid itinerary ID', 400);
    }

    return result.data;
  }

  private parseExpeditionId(value: unknown): string {
    const result = expeditionIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid expedition ID', 400);
    }

    return result.data;
  }
}
