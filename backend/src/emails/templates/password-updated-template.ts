import { emailLayout, escapeHtml } from './email-layout.js';

export const passwordUpdatedTemplate = (action: 'changed' | 'reset', name: string): string => {
  const safeName = escapeHtml(name.trim() || 'there');

  return emailLayout(
    'Account security',
    `Your password was ${action}`,
    `<p>Hi <strong>${safeName}</strong>,</p>
    <p>The password for your Rocklizard Adventure admin account was successfully ${action}.</p>
    <p>If you made this change, no action is needed. If you didn’t, contact Rocklizard Adventure support immediately.</p>`,
  );
};
