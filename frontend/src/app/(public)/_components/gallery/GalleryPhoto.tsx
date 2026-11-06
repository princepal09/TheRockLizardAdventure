"use client";

import ScrollReveal from "../ScrollReveal";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { GalleryImage } from "@/types/gallery";

export default function GalleryPhoto({
  photo,
  className,
}: {
  photo: Pick<GalleryImage, "imageUrl" | "altText">;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  const { imageUrl, altText } = photo;
  const hasImage = !failed && /^(?:https?:\/\/|\/(?!\/))/i.test(imageUrl);

  return (
    <ScrollReveal
      as="figure"
      className={`group relative isolate min-w-0 overflow-hidden bg-slate-200 ${className}`}
    >
      {hasImage ? (
        <Image
          src={imageUrl}
          alt={altText ?? ""}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loader={imageLoaderFor(imageUrl)}
          unoptimized={!canOptimizeImage(imageUrl)}
          onError={() => setFailed(true)}
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.035]"
        />
      ) : (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-2 text-xs text-slate-600">
          <ImageOff aria-hidden="true" className="size-6" /> Photo unavailable
        </div>
      )}
      {altText && (
        <figcaption
          aria-hidden={hasImage || undefined}
          className={`absolute inset-x-0 bottom-0 px-3.5 pt-6 pb-3 text-xs font-medium ${hasImage ? "bg-linear-to-t from-slate-950/85 to-transparent text-white" : "text-slate-700"}`}
        >
          {altText}
        </figcaption>
      )}
    </ScrollReveal>
  );
}
