import type { Request, Response } from 'express';
import { AppError } from '../../utils/common/error/AppError.js';
import { catchAsync } from '../../utils/common/helpers/CathAsync.js';
import { sendResponse } from '../../utils/response/AppResponse.js';
import { contactIdSchema } from './contact.schema.js';
import type { ContactService } from './contact.service.js';

export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  createContactController = catchAsync(async (req: Request, res: Response) => {
    await this.contactService.createContact(req.body);
    sendResponse(res, 201, { success: true, message: 'Your enquiry was received' });
  });

  getContactsController = catchAsync(async (_req: Request, res: Response) => {
    const contacts = await this.contactService.getContacts();
    sendResponse(res, 200, {
      success: true,
      message: 'Enquiries fetched successfully',
      data: contacts,
    });
  });

  getContactController = catchAsync(async (req: Request, res: Response) => {
    const contact = await this.contactService.getContact(this.parseContactId(req.params.contactId));
    sendResponse(res, 200, {
      success: true,
      message: 'Enquiry fetched successfully',
      data: contact,
    });
  });

  updateContactController = catchAsync(async (req: Request, res: Response) => {
    const contact = await this.contactService.updateContact(
      this.parseContactId(req.params.contactId),
      req.body,
    );
    sendResponse(res, 200, {
      success: true,
      message: 'Enquiry updated successfully',
      data: contact,
    });
  });

  private parseContactId(value: unknown): string {
    const result = contactIdSchema.safeParse(value);
    if (!result.success) {
      throw new AppError('Invalid enquiry ID', 400);
    }
    return result.data;
  }
}
