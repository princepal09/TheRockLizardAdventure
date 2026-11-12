import type { ApiDataResponse } from "@/types/api";
import type {
  ItineraryInput,
  Trip,
  TripDetail,
  TripInput,
  TripKind,
  TripPhotoInput,
} from "@/types/trip";

import api from "../axios";
import { getTripOptions } from "./trip-options";
export async function getTrips(kind: TripKind, signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<Trip[]>>(`/${kind}/admin`, {
    signal,
  });
  return data.data;
}

export async function getTrip(kind: TripKind, id: string, signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<TripDetail>>(
    `/${kind}/${encodeURIComponent(id)}`,
    { signal },
  );
  return data.data;
}

export async function getTripEditorOptions(signal: AbortSignal) {
  const [regions, seasons] = await Promise.all([
    getTripOptions("regions", signal),
    getTripOptions("seasons", signal),
  ]);
  return { regions, seasons };
}

export function saveTrip(
  kind: TripKind,
  id: undefined,
  input: TripInput,
  cover?: File,
): Promise<Trip>;
export function saveTrip(kind: TripKind, id: string, input: Partial<TripInput>): Promise<Trip>;
export async function saveTrip(
  kind: TripKind,
  id: string | undefined,
  input: Partial<TripInput>,
  cover?: File,
) {
  if (cover) {
    const body = new FormData();
    body.set("coverImage", cover);
    for (const [name, value] of Object.entries(input)) {
      if (value == null) continue;
      body.set(name, typeof value === "object" ? JSON.stringify(value) : String(value));
    }
    const { data } = await api.post<ApiDataResponse<Trip>>(`/${kind}`, body);
    return data.data;
  }

  const response = id
    ? await api.patch<ApiDataResponse<Trip>>(`/${kind}/${id}`, input)
    : await api.post<ApiDataResponse<Trip>>(`/${kind}`, input);
  return response.data.data;
}

export async function deleteTrip(kind: TripKind, id: string) {
  await api.delete(`/${kind}/${id}`);
}

export async function uploadTripCover(kind: TripKind, id: string, file: File) {
  const body = new FormData();
  body.set("coverImage", file);
  await api.patch(`/${kind}/${id}`, body);
}

export async function saveTripItinerary(
  kind: TripKind,
  tripId: string,
  input: ItineraryInput,
  id?: string,
) {
  const url = `/${kind}/${tripId}/itineraries`;
  if (id) {
    await api.patch(`${url}/${id}`, input);
  } else {
    await api.post(url, input);
  }
}

export async function deleteTripItinerary(kind: TripKind, tripId: string, id: string) {
  await api.delete(`/${kind}/${tripId}/itineraries/${id}`);
}

export async function uploadTripPhotos(kind: TripKind, tripId: string, files: File[]) {
  const body = new FormData();
  files.forEach((file) => body.append("images", file));
  await api.post(`/${kind}/${tripId}/images`, body);
}

export async function updateTripPhoto(
  kind: TripKind,
  tripId: string,
  id: string,
  input: TripPhotoInput,
) {
  await api.patch(`/${kind}/${tripId}/images/${id}`, input);
}

export async function deleteTripPhoto(kind: TripKind, tripId: string, id: string) {
  await api.delete(`/${kind}/${tripId}/images/${id}`);
}
