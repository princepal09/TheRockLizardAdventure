import { pageMetadata } from "@/lib/page-metadata";

import GallerySection from "../_components/gallery/GallerySection";

export const metadata = pageMetadata('Trail Gallery', 'Browse photographs from Rock Lizard Adventure’s treks and expeditions in Uttarakhand.', "/gallery");

export default function GalleryPage() {
  return (
    <main>
      <GallerySection />
    </main>
  );
}
