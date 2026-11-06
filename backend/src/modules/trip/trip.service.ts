import { Prisma } from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import { createWithSlug } from '../../utils/common/create-with-slug.js';
import { withPublicationDate } from '../../utils/common/trip-publication.js';
import { cleanupDeletedTrips } from '../../utils/common/cleanup-deleted-trips.js';
import type { ITripRepository } from './trip.interface.js';
import type { CreateTripDTO, UpdateTripDTO } from './trip.schema.js';

export class TripService {
  async publishSelected(ids: string[]) {
    return this.tripRepo.publishSelected(ids);
  }

  async deleteSelected(ids: string[]) {
    return cleanupDeletedTrips(await this.tripRepo.deleteSelected(ids));
  }

  constructor(private readonly tripRepo: ITripRepository) {}

  async createTrip(data: CreateTripDTO, adminId: string, file?: Express.Multer.File) {
    data = withPublicationDate(data);
    const image = file ? await uploadToCloudinary(file, 'rocklizard/trips') : undefined;
    const fields = image
      ? { ...data, coverImageUrl: image.secure_url, coverImagePublicId: image.public_id }
      : data;

    try {
      return await createWithSlug(data.name, 'trip', 200, (slug) =>
        this.tripRepo.createTrip({ ...fields, slug }, adminId),
      );
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      this.handleWriteError(error);
    }
  }

  async getTrips() {
    return this.tripRepo.findTrips();
  }

  async getTrip(id: string) {
    const trip = await this.tripRepo.findTripById(id);

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    return trip;
  }

  async getPublishedTrips() {
    return this.tripRepo.findPublishedTrips();
  }

  async getPublishedTrip(slug: string) {
    const trip = await this.tripRepo.findPublishedTripBySlug(slug);

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    return trip;
  }

  async updateTrip(id: string, data: UpdateTripDTO, file?: Express.Multer.File) {
    if (!file && Object.keys(data).length === 0) {
      throw new AppError('Provide at least one field to update', 400);
    }

    const current =
      file || data.coverImageUrl !== undefined || data.status === 'PUBLISHED'
        ? await this.getTrip(id)
        : undefined;
    data = withPublicationDate(data, current);
    const image = file ? await uploadToCloudinary(file, 'rocklizard/trips') : undefined;
    const replacingImage = current && (image || data.coverImageUrl !== current.coverImageUrl);
    const changes = replacingImage
      ? {
          ...data,
          coverImageUrl: image?.secure_url ?? data.coverImageUrl,
          coverImagePublicId: image?.public_id ?? null,
        }
      : data;

    try {
      const trip = await this.tripRepo.updateTrip(id, changes, current?.coverImagePublicId);
      if (replacingImage) await this.cleanupImage(current.coverImagePublicId);
      return trip;
    } catch (error) {
      await this.cleanupImage(image?.public_id);
      if (
        current &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        await this.getTrip(id);
        throw new AppError('Trip cover image changed. Retry the update', 409);
      }
      this.handleWriteError(error);
    }
  }

  async deleteTrip(id: string): Promise<void> {
    try {
      const trip = await this.tripRepo.deleteTrip(id);
      await this.cleanupImage(trip.coverImagePublicId);
      await Promise.all(trip.images.map((image) => this.cleanupImage(image.imagePublicId)));
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async createItinerary(tripId: string, data: CreateItineraryDTO) {
    try {
      return await this.tripRepo.createItinerary(tripId, data);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  async updateItinerary(tripId: string, id: string, data: UpdateItineraryDTO) {
    try {
      return await this.tripRepo.updateItinerary(tripId, id, data);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  async deleteItinerary(tripId: string, id: string): Promise<void> {
    try {
      await this.tripRepo.deleteItinerary(tripId, id);
    } catch (error) {
      this.handleItineraryError(error);
    }
  }

  private handleItineraryError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('An itinerary already exists for this day', 409);
        case 'P2003':
          throw new AppError('Trip not found', 404);
        case 'P2025':
          throw new AppError('Itinerary day not found', 404);
      }
    }

    throw error;
  }

  async createGalleryImages(tripId: string, files: Express.Multer.File[]) {
    if (files.length === 0 || files.length > 5) {
      throw new AppError('Upload between 1 and 5 photos', 400);
    }

    await this.getTrip(tripId);
    const images: CreateGalleryImageDTO[] = [];

    try {
      for (const file of files) {
        const image = await uploadToCloudinary(file, 'rocklizard/trips/gallery');
        images.push({ imageUrl: image.secure_url, imagePublicId: image.public_id });
      }

      return await this.tripRepo.createGalleryImages(tripId, images);
    } catch (error) {
      await Promise.all(images.map((image) => this.cleanupImage(image.imagePublicId)));
      this.handleGalleryError(error);
    }
  }

  async updateGalleryImage(tripId: string, id: string, data: UpdateGalleryImageDTO) {
    try {
      return await this.tripRepo.updateGalleryImage(tripId, id, data);
    } catch (error) {
      this.handleGalleryError(error);
    }
  }

  async deleteGalleryImage(tripId: string, id: string): Promise<void> {
    try {
      const image = await this.tripRepo.deleteGalleryImage(tripId, id);
      await this.cleanupImage(image.imagePublicId);
    } catch (error) {
      this.handleGalleryError(error);
    }
  }

  private handleGalleryError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003':
          throw new AppError('Trip not found', 404);
        case 'P2025':
          throw new AppError('Gallery image not found', 404);
      }
    }

    throw error;
  }

  private async cleanupImage(publicId?: string | null): Promise<void> {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete trip cover image from Cloudinary');
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new AppError('A trip with this slug already exists', 409);
        case 'P2003':
          throw new AppError('The operation references a missing or linked record', 409);
        case 'P2025':
          throw new AppError('Trip not found', 404);
      }
    }

    throw error;
  }
}
