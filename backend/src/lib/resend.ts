import { readFile } from 'node:fs/promises';
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
  const logo = await readFile('assets/rocklizard-logo-transparent.png');
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
