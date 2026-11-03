import { randomUUID } from 'node:crypto';
import { Prisma } from '../../../generated/prisma/client.js';

export async function createWithSlug<Result>(
  name: string,
  fallback: string,
  maxBaseLength: number,
  create: (slug: string) => Promise<Result>,
): Promise<Result> {
  const baseSlug =
    name
      .normalize('NFKD')
      .replace(/\p{Mark}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-/, '')
      .slice(0, maxBaseLength)
      .replace(/-$/, '') || fallback;

  // Let the database's unique constraint arbitrate concurrent creates.
  for (let attempt = 1; attempt <= 9; attempt++) {
    try {
      return await create(attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`);
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error;
      }
    }
  }

  return create(`${baseSlug}-${randomUUID().slice(0, 8)}`);
}
