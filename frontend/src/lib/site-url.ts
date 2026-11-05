// Use the client's published domain; override for a different deployment.
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.trladventure.com")
  .origin;
