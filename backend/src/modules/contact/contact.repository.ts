import { prisma } from '../../lib/prisma.js';
import type { IContactRepository } from './contact.interface.js';
import type { CreateContactDTO, UpdateContactDTO } from './contact.schema.js';

const contactTrips = {
  trek: { select: { name: true, slug: true } },
  expedition: { select: { name: true, slug: true } },
  trip: { select: { name: true, slug: true } },
} as const;

export class ContactRepository implements IContactRepository {
  async markSelectedRead(ids: string[]) {
    const result = await prisma.contact.updateMany({
      where: { id: { in: ids }, status: 'UNREAD' },
      data: { status: 'READ' },
    });
    return result.count;
  }

  async createContact(data: CreateContactDTO) {
    return prisma.contact.create({ data, include: contactTrips });
  }

  async findContacts() {
    return prisma.contact.findMany({
      include: contactTrips,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findContactById(id: string) {
    return prisma.contact.findUnique({ where: { id }, include: contactTrips });
  }

  async updateContact(id: string, data: UpdateContactDTO) {
    return prisma.contact.update({ where: { id }, data, include: contactTrips });
  }
}
