import type { ApiDataResponse } from "@/types/api";
import type { Region, Season, TripOptionInput, TripOptionKind } from "@/types/trip-option";

import api from "../axios";

export async function getTripOptions(kind: TripOptionKind, signal: AbortSignal) {
  const path = kind === "regions" ? "/regions" : "/seasons/admin";
  const { data } = await api.get<ApiDataResponse<(Region | Season)[]>>(path, { signal });
  return data.data;
}

export async function getTripOption(kind: TripOptionKind, id: string, signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<Region | Season>>(
    `/${kind}/${encodeURIComponent(id)}`,
    { signal },
  );
  return data.data;
}

export async function saveTripOption(id: string | undefined, input: TripOptionInput) {
  const { name, description, isActive, kind } = input;
  const fields = { name, description, isActive };
  let body: FormData | Record<string, string | number | boolean | null> = fields;

  if (input.kind === "seasons") {
    body = { ...fields, startMonth: input.startMonth, endMonth: input.endMonth };
  } else if (input.image) {
    if (input.image.size > 5 * 1024 * 1024) {
      throw new Error("Choose a region image up to 5 MB.");
    }

    const form = new FormData();
    form.set("name", name);
    form.set("description", description ?? "");
    form.set("isActive", String(isActive));
    form.set("image", input.image);
    body = form;
  }

  if (id) {
    await api.patch(`/${kind}/${encodeURIComponent(id)}`, body);
  } else {
    await api.post(`/${kind}`, body);
  }
}

export async function deleteTripOption(kind: TripOptionKind, id: string) {
  await api.delete(`/${kind}/${encodeURIComponent(id)}`);
}
