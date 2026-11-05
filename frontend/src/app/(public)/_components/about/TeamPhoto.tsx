"use client";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";

import Image from "next/image";
import { useState } from "react";

export default function TeamPhoto({
  name,
  src,
}: {
  name: string;
  src: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return (
    <div className="relative grid h-full aspect-[5/4] place-items-center overflow-hidden bg-slate-200 text-slate-600 md:min-h-[23rem] md:aspect-auto">
      {src && !failed && /^(?:https?:\/\/|\/(?!\/))/i.test(src) ? (
        <Image
          src={src}
          alt=""
          fill
          loader={imageLoaderFor(src)} unoptimized={!canOptimizeImage(src)}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-16 place-items-center rounded-full bg-white/75 font-heading text-2xl font-bold uppercase"
        >
          {initials}
        </span>
      )}
    </div>
  );
}
