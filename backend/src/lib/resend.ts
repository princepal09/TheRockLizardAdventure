import { env } from '../config/env.config.js';

import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export default resend;

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  const { error } = await resend.emails.send({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error('Failed to send email');
  }
};
