import { env } from '../../config/env.config.js';
import { logger } from '../../lib/logger.js';
import { sendEmail } from '../../lib/resend.js';
import { passwordResetTemplate } from '../templates/password-reset-template.js';
import { passwordUpdatedTemplate } from '../templates/password-updated-template.js';

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

export const sendPasswordUpdatedEmail = async (
  recipient: { email: string; name: string },
  action: 'changed' | 'reset',
): Promise<void> => {
  try {
    await sendEmail({
      to: recipient.email,
      subject: `Your password was ${action}`,
      html: passwordUpdatedTemplate(action, recipient.name),
    });
  } catch (error) {
    logger.warn({ err: error, action }, 'Failed to send password update notification');
  }
};
