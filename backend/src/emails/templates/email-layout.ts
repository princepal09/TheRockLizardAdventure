export const emailLogoId = 'rocklizard-logo';
export const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const emailLayout = (label: string, title: string, content: string): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Rocklizard Adventure</title>
</head>
<body style="margin:0;background:#edf7fb;color:#183244;font-family:Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf7fb">
    <tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-top:6px solid #dc650f;border-radius:12px">
        <tr><td align="center" style="padding:24px;background:#142f40;border-radius:6px 6px 0 0">
          <img src="cid:${emailLogoId}" width="240" alt="Rocklizard Adventure" style="display:block;width:240px;max-width:100%;height:auto;color:#fff">
        </td></tr>
        <tr><td style="padding:28px 24px;font-size:16px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word">
          <p style="margin:0;color:#126187;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px">${escapeHtml(label)}</p>
          <h1 style="margin:8px 0 16px;color:#142f40;font-size:26px;line-height:1.2">${escapeHtml(title)}</h1>
          ${content}
        </td></tr>
        <tr><td align="center" style="padding:16px;background:#dff3fb;border-top:1px solid #b9e3f4;color:#183244;font-size:13px">
          Rocklizard Adventure
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
