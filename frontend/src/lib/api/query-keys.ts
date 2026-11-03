import type { TripKind } from "@/types/trip";

export const authKeys = {
  all: ["auth"] as const,

  currentAdmin: () => [...authKeys.all, "current-admin"] as const,
};
export const enquiryKeys = {
  all: ["enquiries"] as const,
  list: (sessionVersion: number) => [...enquiryKeys.all, sessionVersion, "list"] as const,
  detail: (sessionVersion: number, id: string) =>
    [...enquiryKeys.all, sessionVersion, "detail", id] as const,
};

export const tripKeys = {
  all: ["trips"] as const,
  session: (version: number) => [...tripKeys.all, version] as const,
  list: (version: number, kind: TripKind) => [...tripKeys.session(version), kind, "list"] as const,
  detail: (version: number, kind: TripKind, id?: string) => [...tripKeys.session(version), kind, "detail", id] as const,
  options: (version: number) => [...tripKeys.session(version), "options"] as const,
};

export const tripOptionKeys = {
  all: ["trip-options"] as const,
  list: (version: number, kind: string) => [...tripOptionKeys.all, version, kind, "list"] as const,
  detail: (version: number, kind: string, id?: string) =>
    [...tripOptionKeys.all, version, kind, "detail", id] as const,
};

export const galleryKeys = {
  all: ["gallery"] as const,
  list: (version: number) => [...galleryKeys.all, version, "list"] as const,
};

export const siteSettingsKeys = {
  all: ["site-settings"] as const,
  detail: (version: number) => [...siteSettingsKeys.all, version] as const,
};

export const teamKeys = {
  public: ["team", "public"] as const,
  admin: ["team", "admin"] as const,
  list: (version: number) => [...teamKeys.admin, version, "list"] as const,
  detail: (version: number, id?: string) => [...teamKeys.admin, version, "detail", id] as const,
};
