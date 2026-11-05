import type { TripPlanningField } from '../trip-planning/trip-planning.schema.js';
import type {
  Expedition,
  ExpeditionImage,
  ExpeditionItinerary,
  Season,
} from '../../../generated/prisma/client.js';
import type { CreateGalleryImageDTO, UpdateGalleryImageDTO } from '../gallery/gallery.schema.js';
import type { CreateItineraryDTO, UpdateItineraryDTO } from '../itinerary/itinerary.schema.js';
import type { CreateExpeditionDTO, UpdateExpeditionDTO } from './expedition.schema.js';

type ExpeditionCover = Partial<Pick<Expedition, 'coverImagePublicId'>>;
export type CreateExpeditionRecord = CreateExpeditionDTO &
  ExpeditionCover &
  Pick<Expedition, 'slug'>;
type ExpeditionSeasons = { seasons: { seasonId: string; season: Season }[] };
type ExpeditionDetails = ExpeditionSeasons & {
  itineraries: ExpeditionItinerary[];
  images: ExpeditionImage[];
};

export interface IExpeditionRepository {
  createExpedition(
    data: CreateExpeditionRecord,
    adminId: string,
  ): Promise<Expedition & ExpeditionSeasons>;
  findExpeditions(): Promise<Expedition[]>;
  findExpeditionById(id: string): Promise<(Expedition & ExpeditionDetails) | null>;
  findPublishedExpeditions(): Promise<
    (Omit<Expedition, 'createdBy' | TripPlanningField> & {
      region: { name: string };
      seasons: { seasonId: string; season: Pick<Season, 'name'> }[];
    })[]
  >;
  findPublishedExpeditionBySlug(
    slug: string,
  ): Promise<
    (Omit<Expedition, 'createdBy'> & ExpeditionDetails & { region: { name: string } }) | null
  >;
  updateExpedition(
    id: string,
    data: UpdateExpeditionDTO & ExpeditionCover,
    coverImagePublicId?: string | null,
  ): Promise<Expedition & ExpeditionSeasons>;
  deleteExpedition(id: string): Promise<Expedition & { images: ExpeditionImage[] }>;
  createGalleryImages(
    expeditionId: string,
    images: CreateGalleryImageDTO[],
  ): Promise<ExpeditionImage[]>;
  updateGalleryImage(
    expeditionId: string,
    id: string,
    data: UpdateGalleryImageDTO,
  ): Promise<ExpeditionImage>;
  deleteGalleryImage(expeditionId: string, id: string): Promise<ExpeditionImage>;
  createItinerary(expeditionId: string, data: CreateItineraryDTO): Promise<ExpeditionItinerary>;
  updateItinerary(
    expeditionId: string,
    id: string,
    data: UpdateItineraryDTO,
  ): Promise<ExpeditionItinerary>;
  deleteItinerary(expeditionId: string, id: string): Promise<void>;
}
