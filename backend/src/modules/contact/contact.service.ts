import { Prisma } from '../../../generated/prisma/client.js';
import { sendContactEmails } from '../../emails/services/send-contact.email.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { IContactRepository } from './contact.interface.js';
import type { CreateContactDTO, UpdateContactDTO } from './contact.schema.js';

export class ContactService {
  async markSelectedRead(ids: string[]) {
    return this.contactRepo.markSelectedRead(ids);
  }

  constructor(private readonly contactRepo: IContactRepository) {}

  async createContact(data: CreateContactDTO): Promise<void> {
    try {
      const contact = await this.contactRepo.createContact(data);
      await sendContactEmails(
        contact,
        contact.trek?.name ?? contact.expedition?.name ?? contact.trip?.name,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new AppError('Selected trip not found', 404);
      }
      throw error;
    }
  }

  async getContacts() {
    return this.contactRepo.findContacts();
  }

  async getContact(id: string) {
    const contact = await this.contactRepo.findContactById(id);
    if (!contact) {
      throw new AppError('Enquiry not found', 404);
    }

    return contact;
  }

  async updateContact(id: string, data: UpdateContactDTO) {
    try {
      return await this.contactRepo.updateContact(id, data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError('Enquiry not found', 404);
      }
      throw error;
    }
  }
}
