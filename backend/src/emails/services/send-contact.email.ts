import { env } from '../../config/env.config.js';
import { logger } from '../../lib/logger.js';
import { sendEmail } from '../../lib/resend.js';
import {
  contactAdminTemplate,
  contactConfirmationTemplate,
} from '../templates/contact-template.js';
import type { Contact } from '../../../generated/prisma/client.js';

export const sendContactEmails = async (contact: Contact, tripName?: string): Promise<void> => {
  const [confirmation, notification] = await Promise.allSettled([
    sendEmail({
      to: contact.email,
      subject: 'We received your enquiry | Rocklizard Adventure',
      html: contactConfirmationTemplate(contact.name),
    }),
    sendEmail({
      to: env.ADMIN_EMAIL,
      replyTo: contact.email,
      subject: 'New website enquiry | Rocklizard Adventure',
      html: contactAdminTemplate({ ...contact, tripName }),
    }),
  ]);

  if (confirmation.status === 'rejected') {
    logger.warn({ contactId: contact.id }, 'Enquiry confirmation email failed');
  }

  if (notification.status === 'rejected') {
    logger.warn({ contactId: contact.id }, 'Enquiry admin notification failed');
  }
};
