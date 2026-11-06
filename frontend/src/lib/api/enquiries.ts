import type { ApiDataResponse, ApiResponse } from "@/types/api";
import type { CreateEnquiryInput, Enquiry, UpdateEnquiryInput } from "@/types/enquiry";
import type { Trip, TripKind } from "@/types/trip";

import api, { publicApi } from "../axios";

export async function createEnquiry(input: CreateEnquiryInput) {
  const { data } = await publicApi.post<ApiResponse>("/enquiries", input);
  return data;
}

export async function getEnquiryTripOptions(signal: AbortSignal) {
  const kinds: TripKind[] = ["treks", "expeditions", "trips"];
  return Promise.all(
    kinds.map(async (kind) => {
      const { data } = await publicApi.get<ApiDataResponse<Pick<Trip, "id" | "name">[]>>(
        `/${kind}`,
        { signal },
      );
      return { kind, trips: data.data };
    }),
  );
}

export async function getEnquiries(signal?: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<Enquiry[]>>("/enquiries", {
    signal,
  });
  return data.data;
}

export async function getEnquiry(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<Enquiry>>(`/enquiries/${encodeURIComponent(id)}`, {
    signal,
  });
  return data.data;
}

export async function updateEnquiry(id: string, input: UpdateEnquiryInput) {
  const { data } = await api.patch<ApiDataResponse<Enquiry>>(
    `/enquiries/${encodeURIComponent(id)}`,
    input,
  );
  return data.data;
}
