"use client";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";

import { Mountain } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

export default function TripPhoto({
  src,
  alt,
  hero = false,
  sizes = hero ? "100vw" : "(min-width: 1024px) 25vw, 50vw",
  className = "object-cover",
  fallback = (
    <div className="absolute inset-0 grid place-items-center bg-slate-800">
      <Mountain aria-hidden="true" className="size-12 text-slate-500" />
    </div>
  ),
}: {
  src?: string | null;
  alt: string;
  hero?: boolean;
  sizes?: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [attempt, setAttempt] = useState<"optimized" | "original" | "failed">("optimized");

  if (attempt === "failed" || !src || !/^(?:https?:\/\/|\/(?!\/))/i.test(src)) {
    return fallback;
  }

  const optimize = attempt === "optimized" && canOptimizeImage(src);

  return (
    <Image
      key={attempt}
      src={src}
      alt={alt}
      fill
      loader={optimize ? imageLoaderFor(src) : undefined}
      unoptimized={!optimize}
      priority={hero}
      sizes={sizes}
      className={className}
      onError={() => setAttempt(optimize ? "original" : "failed")}
    />
  );
}
