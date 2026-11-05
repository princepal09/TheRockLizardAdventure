import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.config.js';
import { emailLogoId } from '../emails/templates/email-layout.js';

import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export default resend;

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions): Promise<void> => {
  const logoPath = existsSync('assets/rocklizard-logo-transparent.png')
    ? 'assets/rocklizard-logo-transparent.png'
    : path.resolve(import.meta.dirname, '../../assets/rocklizard-logo-transparent.png');
  const logo = await readFile(logoPath);
  const { error } = await resend.emails.send({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    replyTo,
    attachments: [
      {
        filename: 'rocklizard-logo.png',
        content: logo,
        contentType: 'image/png',
        contentId: emailLogoId,
      },
    ],
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error('Failed to send email');
  }
};
