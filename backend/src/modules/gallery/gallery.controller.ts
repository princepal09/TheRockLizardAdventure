import type { Request, Response } from 'express';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { galleryImageIdSchema } from './gallery.schema.js';
import type { GalleryService } from './gallery.service.js';

export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  getActiveImagesController = catchAsync(async (_req: Request, res: Response) => {
    const images = await this.galleryService.getActiveImages();
    sendResponse(res, 200, {
      success: true,
      message: 'Gallery images fetched successfully',
      data: images,
    });
  });

  getImagesController = catchAsync(async (_req: Request, res: Response) => {
    const images = await this.galleryService.getImages();
    sendResponse(res, 200, {
      success: true,
      message: 'Gallery images fetched successfully',
      data: images,
    });
  });

  createImagesController = catchAsync(async (req: Request, res: Response) => {
    const images = await this.galleryService.createImages(
      Array.isArray(req.files) ? req.files : [],
    );
    sendResponse(res, 201, {
      success: true,
      message: 'Gallery images uploaded successfully',
      data: images,
    });
  });

  updateImageController = catchAsync(async (req: Request, res: Response) => {
    const image = await this.galleryService.updateImage(
      this.parseImageId(req.params.imageId),
      req.body,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Gallery image updated successfully',
      data: image,
    });
  });

  deleteImageController = catchAsync(async (req: Request, res: Response) => {
    await this.galleryService.deleteImage(this.parseImageId(req.params.imageId));
    sendResponse(res, 200, { success: true, message: 'Gallery image deleted successfully' });
  });

  private parseImageId(value: unknown): string {
    const result = galleryImageIdSchema.safeParse(value);
    if (!result.success) {
      throw new AppError('Invalid gallery image ID', 400);
    }

    return result.data;
  }

  deleteAllImagesController = catchAsync(async (_req: Request, res: Response) => {
    const result = await this.galleryService.deleteAllImages();
    sendResponse(res, 200, {
      success: true,
      message: 'All site gallery photos removed',
      data: result,
    });
  });
}
