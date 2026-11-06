export const publicContentTags = {
  treks: ["published-treks"],
  expeditions: ["published-expeditions"],
  trips: ["published-trips"],
  regions: ["published-treks", "published-expeditions", "published-trips"],
  seasons: ["public-seasons", "published-treks", "published-expeditions", "published-trips"],
  gallery: ["public-gallery"],
  team: ["public-team"],
  "site-settings": ["site-settings"],
} as const;

export type PublicContentScope = keyof typeof publicContentTags;

export function publicContentScope(url: string): PublicContentScope | undefined {
  const match =
    /^\/?(treks|expeditions|trips|regions|seasons|gallery|team|site-settings)(?:\/|$)/.exec(url);
  return match?.[1] as PublicContentScope | undefined;
}
