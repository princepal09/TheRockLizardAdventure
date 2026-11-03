import type { ApiDataResponse } from "@/types/api";
import type { TeamMember, TeamMemberInput } from "@/types/team";

import api, { publicApi } from "../axios";

export async function getPublicTeam(signal: AbortSignal) {
  const { data } = await publicApi.get<ApiDataResponse<TeamMember[]>>("/team", { signal });
  return data.data;
}

export async function getTeamMembers(signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<TeamMember[]>>("/team/admin", { signal });
  return data.data;
}

export async function getTeamMember(id: string, signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<TeamMember>>(
    `/team/${encodeURIComponent(id)}`,
    { signal },
  );
  return data.data;
}

export async function saveTeamMember(id: string | undefined, input: TeamMemberInput, photo?: File) {
  let body: TeamMemberInput | FormData = input;
  if (photo) {
    if (!photo.size || photo.size > 5 * 1024 * 1024) {
      throw new Error("Choose a photo up to 5 MB.");
    }

    const form = new FormData();
    Object.entries(input).forEach(([key, value]) => form.set(key, String(value ?? "")));
    form.set("photo", photo);
    body = form;
  }

  if (id) {
    await api.patch(`/team/${encodeURIComponent(id)}`, body);
  } else {
    await api.post("/team", body);
  }
}

export async function deleteTeamMember(id: string) {
  await api.delete(`/team/${encodeURIComponent(id)}`);
}
