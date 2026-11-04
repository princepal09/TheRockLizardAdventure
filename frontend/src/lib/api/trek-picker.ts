import type { ApiDataResponse } from "@/types/api";
import type { Trip } from "@/types/trip";
import type { Region, Season } from "@/types/trip-option";

import { publicApi } from "../axios";

type PickerTrek = Pick<Trip, "id" | "name" | "regionId" | "slug"> & {
  months: { month: number }[];
  seasons: { seasonId: string }[];
};

export async function getPublishedPickerTreks(signal: AbortSignal) {
  const { data } = await publicApi.get<ApiDataResponse<PickerTrek[]>>(
    "/treks",
    { signal },
  );
  return data.data;
}

export async function getTrekPickerData(signal: AbortSignal) {
  const [treks, regions, seasons] = await Promise.all([
    getPublishedPickerTreks(signal),
    publicApi.get<ApiDataResponse<Region[]>>("/regions", { signal }),
    publicApi.get<ApiDataResponse<Season[]>>("/seasons", { signal }),
  ]);

  return {
    treks,
    regions: regions.data.data.filter((region) => region.isActive),
    seasons: seasons.data.data,
  };
}
