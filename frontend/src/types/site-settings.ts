export type SiteSettings = {
  logoUrl: string | null;
  heroImageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsappPhone: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
};

export type SiteSettingsUpdate = Partial<SiteSettings> | FormData;
