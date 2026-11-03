import type { ApiDataResponse } from "@/types/api";
import type { GalleryImage, GalleryImageInput } from "@/types/gallery";

import api from "../axios";

export async function getGalleryImages(signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<GalleryImage[]>>("/gallery/admin", { signal });
  return data.data;
}

export async function uploadGalleryImages(files: File[]) {
  const body = new FormData();
  files.forEach((file) => body.append("images", file));
  await api.post("/gallery", body);
}

export async function updateGalleryImage(id: string, input: GalleryImageInput) {
  await api.patch(`/gallery/${encodeURIComponent(id)}`, input);
}

export async function deleteGalleryImage(id: string) {
  await api.delete(`/gallery/${encodeURIComponent(id)}`);
}
