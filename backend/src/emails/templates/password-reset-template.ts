import { emailLayout, escapeHtml } from './email-layout.js';

export const passwordResetTemplate = (resetUrl: string, name?: string): string => {
  const safeName = escapeHtml(name?.trim() || 'there');
  const safeUrl = escapeHtml(resetUrl);

  return emailLayout(
    'Account security',
    'Reset your password',
    `<p>Hi <strong>${safeName}</strong>,</p>
    <p>We received a request to reset the password for your Rocklizard Adventure account. This link is valid for <strong>15 minutes</strong>.</p>
    <p style="margin:24px 0">
      <a href="${safeUrl}" style="display:inline-block;padding:12px 22px;background:#ac4709;color:#fff;border-radius:6px;font-weight:bold;text-decoration:none">Reset password</a>
    </p>
    <p style="font-size:13px">If the button doesn’t work, copy this link into your browser:<br>
    <a href="${safeUrl}" style="color:#126187">${safeUrl}</a></p>
    <p style="font-size:13px;color:#465c6b">If you didn’t request a password reset, you can ignore this email.</p>`,
  );
};
