import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  reviewId: z.string().nullable(),
  reviewer: z.object({
    displayName: z.string(),
    profilePhotoUrl: z.string().default(""),
    isAnonymous: z.boolean().default(false),
  }),
  starRating: z.number().min(1).max(5),
  comment: z.string().default(""),
  createTime: z.string().nullable(),
  updateTime: z.string().nullable(),
});

const responseSchema = z.object({
  success: z.literal(true),
  averageRating: z.coerce.number().min(0).max(5),
  totalReviewCount: z.coerce.number().int().nonnegative(),
  profileUrl: z.string().nullable(),
  reviews: z.array(reviewSchema),
});

export type GoogleReviewsData = z.infer<typeof responseSchema>;

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  "use cache";
  cacheTag("google-reviews");

  const widgetId = process.env.NEXT_FEATURABLE_WIDGET_ID?.trim();
  if (!widgetId) {
    cacheLife("hours");
    return null;
  }

  try {
    const response = await fetch(
      `https://featurable.com/api/v1/widgets/${encodeURIComponent(widgetId)}`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!response.ok) throw new Error("Could not load Google reviews");
    const data = responseSchema.parse(await response.json());
    cacheLife("hours");
    return data;
  } catch {
    // Handle outages inside the cache boundary so prerendering can still finish.
    cacheLife({ stale: 30, revalidate: 60, expire: 300 });
    return null;
  }
}
