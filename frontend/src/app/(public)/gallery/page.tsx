import { pageMetadata } from "@/lib/page-metadata";

import GallerySection from "../_components/gallery/GallerySection";

export const metadata = pageMetadata(
  "Trail Gallery",
  "Browse the Rock Lizard Adventure trail gallery and explore our adventures across India.",
  "/gallery",
);

export default function GalleryPage() {
  return (
    <main>
      <GallerySection />
    </main>
  );
}
