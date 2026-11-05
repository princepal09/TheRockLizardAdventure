import type { Metadata } from "next";
import { siteUrl } from "./site-url";

export function pageMetadata(title: string, description: string, path: string, image = "/image4.jpeg"): Metadata {
  const absoluteTitle = `${title} | Rocklizard Adventure`;
  const candidate = URL.parse(image, siteUrl);
  const imageUrl = candidate && ["https:", "http:"].includes(candidate.protocol) ? candidate.href : `${siteUrl}/image4.jpeg`;
  return {
    title, description,
    alternates: { canonical: new URL(path, siteUrl).href },
    openGraph: { type: "website", locale: "en_IN", siteName: "Rocklizard Adventure", title: absoluteTitle, description, url: new URL(path, siteUrl).href, images: [{ url: imageUrl, alt: title }] },
    twitter: { card: "summary_large_image", title: absoluteTitle, description, images: [imageUrl] },
  };
}
