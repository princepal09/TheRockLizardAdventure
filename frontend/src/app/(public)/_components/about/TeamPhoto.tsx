"use client";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";

import Image from "next/image";
import { useState } from "react";

export default function TeamPhoto({ name, src }: { name: string; src: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return (
    <div className="relative grid size-36 place-items-center overflow-hidden rounded-full bg-slate-200 text-slate-600 sm:size-44">
      {src && !failed && /^(?:https?:\/\/|\/(?!\/))/i.test(src) ? (
        <Image
          src={src}
          alt=""
          fill
          loader={imageLoaderFor(src)}
          unoptimized={!canOptimizeImage(src)}
          sizes="(min-width: 640px) 176px, 144px"
          className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true" className="font-heading text-4xl font-bold uppercase sm:text-5xl">
          {initials}
        </span>
      )}
    </div>
  );
}
