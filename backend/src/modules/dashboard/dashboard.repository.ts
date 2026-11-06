import { ContactStatus, ContentStatus, Prisma } from '../../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

export class DashboardRepository {
  async getSummary() {
    const [publishedTreks, publishedExpeditions, publishedTrips, unreadEnquiries, recentEnquiries] =
      await prisma.$transaction(
        [
          prisma.trek.count({ where: { status: ContentStatus.PUBLISHED } }),
          prisma.expedition.count({ where: { status: ContentStatus.PUBLISHED } }),
          prisma.trip.count({ where: { status: ContentStatus.PUBLISHED } }),
          prisma.contact.count({ where: { status: ContactStatus.UNREAD } }),
          prisma.contact.findMany({
            take: 5,
            orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
            select: { id: true, name: true, subject: true, status: true, createdAt: true },
          }),
        ],
        { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
      );

    return {
      publishedTreks,
      publishedExpeditions,
      publishedTrips,
      unreadEnquiries,
      recentEnquiries,
    };
  }
}
