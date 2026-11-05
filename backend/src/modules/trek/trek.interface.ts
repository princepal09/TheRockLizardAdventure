import type { TripPlanningField } from '../trip-planning/trip-planning.schema.js';
import type { Trek, TrekImage, TrekItinerary, Season } from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateTrekDTO, UpdateTrekDTO } from './trek.schema.js';

type TrekCover = Partial<Pick<Trek, 'coverImagePublicId'>>;
export type CreateTrekRecord = CreateTrekDTO & TrekCover & Pick<Trek, 'slug'>;
type TrekSeasons = { seasons: { seasonId: string; season: Season }[] };
type TrekDetails = TrekSeasons & { itineraries: TrekItinerary[]; images: TrekImage[] };

export interface ITrekRepository {
  createTrek(data: CreateTrekRecord, adminId: string): Promise<Trek & TrekSeasons>;
  findTreks(): Promise<Trek[]>;
  findTrekById(id: string): Promise<(Trek & TrekDetails) | null>;
  findPublishedTreks(): Promise<
    (Omit<Trek, 'createdBy' | TripPlanningField> & {
      months: { month: number }[];
      region: { name: string };
      seasons: { seasonId: string; season: Pick<Season, 'name'> }[];
    })[]
  >;
  findPublishedTrekBySlug(slug: string): Promise<
    | (Omit<Trek, 'createdBy'> &
        TrekDetails & {
          region: { name: string };
          months: { month: number }[];
        })
    | null
  >;
  updateTrek(
    id: string,
    data: UpdateTrekDTO & TrekCover,
    coverImagePublicId?: string | null,
  ): Promise<Trek & TrekSeasons>;
  deleteTrek(id: string): Promise<Trek & { images: TrekImage[] }>;
  createGalleryImages(trekId: string, images: CreateGalleryImageDTO[]): Promise<TrekImage[]>;
  updateGalleryImage(trekId: string, id: string, data: UpdateGalleryImageDTO): Promise<TrekImage>;
  deleteGalleryImage(trekId: string, id: string): Promise<TrekImage>;
  createItinerary(trekId: string, data: CreateItineraryDTO): Promise<TrekItinerary>;
  updateItinerary(trekId: string, id: string, data: UpdateItineraryDTO): Promise<TrekItinerary>;
  deleteItinerary(trekId: string, id: string): Promise<void>;
}
