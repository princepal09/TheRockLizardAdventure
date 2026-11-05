export const homepageTripLimits = { treks: 6, expeditions: 4 } as const;

// The API supplies newest-first order; stable sorting keeps that order within
// featured and non-featured groups. Only the selected cards reach the browser.
export function selectHomepageTrips<T extends { isFeatured: boolean }>(
  trips: readonly T[],
  limit: number,
): T[] {
  return trips.toSorted((a, b) => Number(b.isFeatured) - Number(a.isFeatured)).slice(0, limit);
}
