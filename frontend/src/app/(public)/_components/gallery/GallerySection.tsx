import ScrollReveal from "../ScrollReveal";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublicGallery } from "@/lib/api/public-gallery";

import GalleryIntro from "./GalleryIntro";
import GalleryPhoto from "./GalleryPhoto";

const tileClasses = [
  "aspect-[4/5] lg:col-start-2 lg:row-start-1 lg:row-span-4 lg:aspect-auto",
  "aspect-[5/4] lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:aspect-auto",
  "aspect-[4/5] lg:row-span-3 lg:aspect-auto",
  "aspect-[5/4] lg:row-span-3 lg:aspect-auto",
  "aspect-[5/4] lg:row-span-2 lg:aspect-auto",
];

function tileClass(index: number) {
  return tileClasses[index < 2 ? index : 2 + ((index - 2) % 3)];
}

async function GalleryPhotos() {
  const photos = await getPublicGallery().catch(() => null);
  if (!photos?.length) {
    return (
      <p
        role="status"
        className="self-start rounded-xl border border-stone-200 bg-white p-5 text-sm text-slate-600 sm:col-span-2 lg:row-span-2"
      >
        {photos
          ? "Photos will appear here when they’re published."
          : "The gallery is temporarily unavailable. Refresh to try again."}
      </p>
    );
  }

  return photos.map((photo, index) => (
    <GalleryPhoto
      key={`${photo.id}:${photo.imageUrl}`}
      photo={photo}
      className={tileClass(index)}
    />
  ));
}

function GallerySkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        Loading gallery photos…
      </span>
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton
          key={index}
          aria-hidden="true"
          className={`rounded-none bg-stone-200 ${tileClass(index)}`}
        />
      ))}
    </>
  );
}

export default function GallerySection() {
  return (
    <ScrollReveal
      as="section"
      aria-labelledby="gallery-heading"
      className="bg-[#f5f3ee] bg-[radial-gradient(ellipse_at_top_right,#f9731620,transparent_42%)] px-4 py-8 text-slate-900 sm:px-6 sm:py-12 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-flow-dense lg:auto-rows-[clamp(4.5rem,7.5vw,6.5rem)] lg:grid-cols-3 lg:gap-5">
        <GalleryIntro />
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryPhotos />
        </Suspense>
      </div>
    </ScrollReveal>
  );
}
