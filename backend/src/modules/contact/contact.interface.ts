import type { Contact } from '../../../generated/prisma/client.js';
import type { CreateContactDTO, UpdateContactDTO } from './contact.schema.js';

export type ContactDetails = Contact & {
  trek: { name: string; slug: string } | null;
  expedition: { name: string; slug: string } | null;
  trip: { name: string; slug: string } | null;
};

export interface IContactRepository {
  markSelectedRead(ids: string[]): Promise<number>;
  createContact(data: CreateContactDTO): Promise<ContactDetails>;
  findContacts(): Promise<ContactDetails[]>;
  findContactById(id: string): Promise<ContactDetails | null>;
  updateContact(id: string, data: UpdateContactDTO): Promise<ContactDetails>;
}
