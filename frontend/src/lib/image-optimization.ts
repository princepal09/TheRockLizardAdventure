import type { ImageLoader } from "next/image";

// Only allow approved public image origins through responsive optimization.
// Other external URLs retain direct delivery rather than breaking existing images.
export function canOptimizeImage(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }

  return (
    url.protocol === "https:" &&
    url.hostname === "res.cloudinary.com" &&
    /^\/[^/]+\/image\/upload\//.test(url.pathname) &&
    !url.pathname.includes("/image/upload/s--")
  );
}

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.pathname = url.pathname.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_${quality ?? 75},c_limit,w_${width}/`,
  );
  return url.href;
};

export function imageLoaderFor(src: string): ImageLoader | undefined {
  return src.startsWith("https://") && canOptimizeImage(src) ? cloudinaryLoader : undefined;
}
