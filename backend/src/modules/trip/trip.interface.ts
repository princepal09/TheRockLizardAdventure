import type { TripPlanningField } from '../trip-planning/trip-planning.schema.js';
import type { Trip, TripImage, TripItinerary, Season } from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateTripDTO, UpdateTripDTO } from './trip.schema.js';

type TripCover = Partial<Pick<Trip, 'coverImagePublicId'>>;
export type CreateTripRecord = CreateTripDTO & TripCover & Pick<Trip, 'slug'>;
type TripSeasons = { seasons: { seasonId: string; season: Season }[] };
type TripDetails = TripSeasons & {
  itineraries: TripItinerary[];
  images: TripImage[];
};

export interface ITripRepository {
  publishSelected(ids: string[]): Promise<{ updatedCount: number }>;
  deleteSelected(ids: string[]): Promise<(Trip & { images: TripImage[] })[]>;
  createTrip(data: CreateTripRecord, adminId: string): Promise<Trip & TripSeasons>;
  findTrips(): Promise<Omit<Trip, 'descriptionRich'>[]>;
  findTripById(id: string): Promise<(Trip & TripDetails) | null>;
  findPublishedTrips(): Promise<
    (Omit<Trip, 'createdBy' | 'descriptionRich' | TripPlanningField> & {
      region: { name: string };
      seasons: { seasonId: string; season: Pick<Season, 'name'> }[];
    })[]
  >;
  findPublishedTripBySlug(
    slug: string,
  ): Promise<(Omit<Trip, 'createdBy'> & TripDetails & { region: { name: string } }) | null>;
  updateTrip(
    id: string,
    data: UpdateTripDTO & TripCover,
    coverImagePublicId?: string | null,
  ): Promise<Trip & TripSeasons>;
  deleteTrip(id: string): Promise<Trip & { images: TripImage[] }>;
  createGalleryImages(tripId: string, images: CreateGalleryImageDTO[]): Promise<TripImage[]>;
  updateGalleryImage(tripId: string, id: string, data: UpdateGalleryImageDTO): Promise<TripImage>;
  deleteGalleryImage(tripId: string, id: string): Promise<TripImage>;
  createItinerary(tripId: string, data: CreateItineraryDTO): Promise<TripItinerary>;
  updateItinerary(tripId: string, id: string, data: UpdateItineraryDTO): Promise<TripItinerary>;
  deleteItinerary(tripId: string, id: string): Promise<void>;
}
