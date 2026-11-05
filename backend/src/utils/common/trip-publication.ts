export function withPublicationDate<T extends { status?: string; publishedAt?: Date | null }>(
  input: T,
  current?: { publishedAt: Date | null },
): T {
  if (input.status !== 'PUBLISHED') return input;
  return { ...input, publishedAt: input.publishedAt ?? current?.publishedAt ?? new Date() };
}

export function sortPublishedTrips<
  T extends { id: string; publishedAt: Date | null; createdAt: Date; updatedAt?: Date },
>(trips: T[]): T[] {
  return trips.sort((a, b) => {
    // Older records may have been published without a publication timestamp.
    const difference =
      (b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime() -
      (a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
    return difference || a.id.localeCompare(b.id);
  });
}
