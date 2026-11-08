import type { Metadata } from "next";
import { siteUrl } from "./site-url";

const defaultImage = {
  url: new URL("/open_graph.jpeg", siteUrl).href,
  type: "image/jpeg",
  width: 1280,
  height: 720,
  alt: "Trekkers walking through a valley beneath snow-covered peaks",
};

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  const absoluteTitle = `${title} | Rocklizard Adventure`;
  const candidate = image ? URL.parse(image, siteUrl) : null;
  const shareImage =
    candidate &&
    ["https:", "http:"].includes(candidate.protocol) &&
    candidate.href !== defaultImage.url
      ? { url: candidate.href, alt: title }
      : defaultImage;
  return {
    title,
    description,
    alternates: { canonical: new URL(path, siteUrl).href },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Rocklizard Adventure",
      title: absoluteTitle,
      description,
      url: new URL(path, siteUrl).href,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: [shareImage],
    },
  };
}
