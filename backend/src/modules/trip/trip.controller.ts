import type { Request, Response } from 'express';
import { galleryImageIdSchema } from '../gallery/gallery.schema.js';
import { itineraryIdSchema } from '../itinerary/itinerary.schema.js';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { tripIdSchema, tripSlugSchema } from './trip.schema.js';
import type { TripService } from './trip.service.js';

export class TripController {
  publishSelectedController = catchAsync(async (req: Request, res: Response) => {
    const result = await this.tripService.publishSelected(req.body.ids);
    sendResponse(res, 200, {
      success: true,
      message: 'Selected trips published',
      data: result,
    });
  });

  deleteSelectedController = catchAsync(async (req: Request, res: Response) => {
    const result = await this.tripService.deleteSelected(req.body.ids);
    sendResponse(res, 200, {
      success: true,
      message: 'Selected trips deleted',
      data: result,
    });
  });

  constructor(private readonly tripService: TripService) {}

  createTripController = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new AppError('Not authorized', 401);
    }

    const trip = await this.tripService.createTrip(req.body, adminId, req.file);

    sendResponse(res, 201, {
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  });

  getTripsController = catchAsync(async (_req: Request, res: Response) => {
    const trips = await this.tripService.getTrips();

    sendResponse(res, 200, {
      success: true,
      message: 'Trips fetched successfully',
      data: trips,
    });
  });

  getTripController = catchAsync(async (req: Request, res: Response) => {
    const trip = await this.tripService.getTrip(this.parseTripId(req.params.tripId));

    sendResponse(res, 200, {
      success: true,
      message: 'Trip fetched successfully',
      data: trip,
    });
  });

  getPublishedTripsController = catchAsync(async (_req: Request, res: Response) => {
    const trips = await this.tripService.getPublishedTrips();

    sendResponse(res, 200, {
      success: true,
      message: 'Trips fetched successfully',
      data: trips,
    });
  });

  getPublishedTripController = catchAsync(async (req: Request, res: Response) => {
    const slug = tripSlugSchema.safeParse(req.params.slug);
    if (!slug.success) {
      throw new AppError('Invalid trip slug', 400);
    }

    const trip = await this.tripService.getPublishedTrip(slug.data);

    sendResponse(res, 200, {
      success: true,
      message: 'Trip fetched successfully',
      data: trip,
    });
  });

  updateTripController = catchAsync(async (req: Request, res: Response) => {
    const trip = await this.tripService.updateTrip(
      this.parseTripId(req.params.tripId),
      req.body,
      req.file,
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  });

  deleteTripController = catchAsync(async (req: Request, res: Response) => {
    await this.tripService.deleteTrip(this.parseTripId(req.params.tripId));

    sendResponse(res, 200, { success: true, message: 'Trip deleted successfully' });
  });

  createItineraryController = catchAsync(async (req: Request, res: Response) => {
    const itinerary = await this.tripService.createItinerary(
      this.parseTripId(req.params.tripId),
      req.body,
    );

    sendResponse(res, 201, {
      success: true,
      message: 'Itinerary day created successfully',
      data: itinerary,
    });
  });

  updateItineraryController = catchAsync(async (req: Request, res: Response) => {
    const itinerary = await this.tripService.updateItinerary(
      this.parseTripId(req.params.tripId),
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
    await this.tripService.deleteItinerary(
      this.parseTripId(req.params.tripId),
      this.parseItineraryId(req.params.itineraryId),
    );

    sendResponse(res, 200, { success: true, message: 'Itinerary day deleted successfully' });
  });

  createGalleryImagesController = catchAsync(async (req: Request, res: Response) => {
    const images = await this.tripService.createGalleryImages(
      this.parseTripId(req.params.tripId),
      Array.isArray(req.files) ? req.files : [],
    );

    sendResponse(res, 201, {
      success: true,
      message: 'Gallery images uploaded successfully',
      data: images,
    });
  });

  updateGalleryImageController = catchAsync(async (req: Request, res: Response) => {
    const image = await this.tripService.updateGalleryImage(
      this.parseTripId(req.params.tripId),
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
    await this.tripService.deleteGalleryImage(
      this.parseTripId(req.params.tripId),
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

  private parseTripId(value: unknown): string {
    const result = tripIdSchema.safeParse(value);

    if (!result.success) {
      throw new AppError('Invalid trip ID', 400);
    }

    return result.data;
  }
}
