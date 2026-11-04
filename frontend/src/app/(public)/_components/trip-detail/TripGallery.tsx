import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";

import { Card } from "@/components/ui/card";

import TripPhoto from "./TripPhoto";

export default function TripGallery({
  images,
}: {
  images: PublishedTripDetail["images"];
}) {
  return (
    <Card
      id="trip-gallery"
      className="scroll-mt-20 gap-4 border border-stone-200 bg-white p-5 text-slate-900 ring-0! sm:p-7"
    >
      <div>
        <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          Himalayan Visual Archive
        </p>
        <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Route &amp; Terrain Gallery
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {images.length} {images.length === 1 ? "photo" : "photos"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {images.map(({ id, imageUrl, altText, caption }) => (
          <figure key={id} className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              <TripPhoto src={imageUrl} alt={altText ?? ""} />
            </div>
            {caption && (
              <figcaption className="mt-1 text-xs text-slate-600">
                {caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </Card>
  );
}
