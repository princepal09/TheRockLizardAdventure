export type TripKind = "treks" | "expeditions";

export const tripStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const tripDifficulties = ["EASY", "MODERATE", "DIFFICULT", "VERY_DIFFICULT", "EXTREME"] as const;

export type TripStatus = (typeof tripStatuses)[number];
export type TripDifficulty = (typeof tripDifficulties)[number];

export type TripInput = {
  name: string;
  regionId: string;
  seasonIds: string[];
  difficulty: TripDifficulty;
  status: TripStatus;
  durationDays: number;
  summary: string | null;
  description: string | null;
  distanceKm: number | null;
  maxAltitudeMeters: number | null;
  startingPoint: string | null;
  endingPoint: string | null;
  price: number | null;
  discountPrice: number | null;
  currency: string;
  maxGroupSize: number | null;
  minAge: number | null;
  maxAge: number | null;
  isFeatured: boolean;
  publishedAt: string | null;
};

type DecimalFields = "distanceKm" | "price" | "discountPrice";

export type Trip = Omit<TripInput, "seasonIds" | DecimalFields> & {
  id: string;
  slug: string;
  coverImageUrl: string | null;
} & Record<DecimalFields, string | number | null>;

export type ItineraryInput = {
  dayNumber: number;
  title: string;
  description: string | null;
  distanceKm: number | null;
  altitudeMeters: number | null;
};

export type TripPhotoInput = {
  altText: string | null;
  caption: string | null;
  sortOrder: number;
};

export type TripDetail = Trip & {
  seasons: { seasonId: string; season: TripOption }[];
  itineraries: (Omit<ItineraryInput, "distanceKm"> & {
    id: string;
    distanceKm: string | number | null;
  })[];
  images: (TripPhotoInput & { id: string; imageUrl: string })[];
};

export type TripOption = { id: string; name: string; isActive: boolean };
