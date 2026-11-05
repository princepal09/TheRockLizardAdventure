export const publicContentTags = {
  treks: ["published-treks"],
  expeditions: ["published-expeditions"],
  regions: ["published-treks", "published-expeditions"],
  seasons: ["public-seasons", "published-treks", "published-expeditions"],
  gallery: ["public-gallery"],
  team: ["public-team"],
  "site-settings": ["site-settings"],
} as const;

export type PublicContentScope = keyof typeof publicContentTags;

export function publicContentScope(url: string): PublicContentScope | undefined {
  const match = /^\/?(treks|expeditions|regions|seasons|gallery|team|site-settings)(?:\/|$)/.exec(url);
  return match?.[1] as PublicContentScope | undefined;
}
