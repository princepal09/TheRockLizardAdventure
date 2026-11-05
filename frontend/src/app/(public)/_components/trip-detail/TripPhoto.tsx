"use client";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";

import { Mountain } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function TripPhoto({
  src,
  alt,
  hero = false,
}: {
  src?: string | null;
  alt: string;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src || !/^(?:https?:\/\/|\/(?!\/))/i.test(src)) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-slate-800">
        <Mountain aria-hidden="true" className="size-12 text-slate-500" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      loader={imageLoaderFor(src)} unoptimized={!canOptimizeImage(src)}
      priority={hero}
      sizes={hero ? "100vw" : "(min-width: 1024px) 25vw, 50vw"}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
