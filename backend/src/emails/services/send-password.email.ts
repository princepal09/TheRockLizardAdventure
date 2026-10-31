import { env } from '../../config/env.config.js';
import { sendEmail } from '../../lib/resend.js';
import { passwordResetTemplate } from '../templates/password-reset-template.js';

export const sendPasswordEmail = async (
  email: string,
  resetToken: string,
  name?: string,
): Promise<void> => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = passwordResetTemplate(resetUrl, name);

  await sendEmail({
    to: email,
    subject: 'Reset your Password',
    html,
  });
};