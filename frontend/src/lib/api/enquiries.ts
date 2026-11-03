import type { ApiDataResponse } from "@/types/api";
import type { Enquiry, UpdateEnquiryInput } from "@/types/enquiry";

import api from "../axios";

export async function getEnquiries(signal?: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<Enquiry[]>>("/enquiries", { signal });
  return data.data;
}

export async function getEnquiry(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<Enquiry>>(
    `/enquiries/${encodeURIComponent(id)}`,
    { signal },
  );
  return data.data;
}

export async function updateEnquiry(id: string, input: UpdateEnquiryInput) {
  const { data } = await api.patch<ApiDataResponse<Enquiry>>(
    `/enquiries/${encodeURIComponent(id)}`,
    input,
  );
  return data.data;
}
