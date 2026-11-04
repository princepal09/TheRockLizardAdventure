import type { Metadata } from "next";

import GallerySection from "../_components/gallery/GallerySection";

export const metadata: Metadata = {
  title: "Trail Gallery",
  description:
    "Browse photographs from Rock Lizard Adventure’s treks and expeditions in Uttarakhand.",
};

export default function GalleryPage() {
  return (
    <main>
      <GallerySection />
    </main>
  );
}
