import { emailLayout, escapeHtml } from './email-layout.js';

interface ContactEmailDetails {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  tripName?: string;
}

export const contactConfirmationTemplate = (name: string): string =>
  emailLayout(
    'Enquiry received',
    'Thanks for getting in touch',
    `<p>Hi <strong>${escapeHtml(name)}</strong>,</p>
    <p>We’ve received your enquiry. The Rocklizard Adventure team will review it and get back to you by email.</p>
    <p>See you on the trail,<br><strong>The Rocklizard Adventure team</strong></p>`,
  );

export const contactAdminTemplate = (contact: ContactEmailDetails): string =>
  emailLayout(
    'Admin enquiries',
    'New website enquiry',
    `<p><strong>Name:</strong> ${escapeHtml(contact.name)}<br>
    <strong>Email:</strong> ${escapeHtml(contact.email)}<br>
    <strong>Phone:</strong> ${escapeHtml(contact.phone ?? 'Not provided')}<br>
    <strong>Subject:</strong> ${escapeHtml(contact.subject ?? 'General enquiry')}<br>
    <strong>Trip:</strong> ${escapeHtml(contact.tripName ?? 'General enquiry')}</p>
    <p style="padding:16px;background:#edf7fb;border-left:4px solid #36a9df">${escapeHtml(contact.message).replace(/\r?\n/g, '<br>')}</p>
    <p>Reply to this email to contact the sender, or open Enquiries in the admin dashboard.</p>`,
  );
