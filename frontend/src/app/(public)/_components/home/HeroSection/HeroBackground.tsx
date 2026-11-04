"use client";

import Image from "next/image";
import { useState } from "react";

const fallbackImage = "/image4.jpeg";

export default function HeroBackground({
  imageUrl,
}: {
  imageUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const remoteImage = failed ? null : imageUrl;

  return (
    <Image
      src={remoteImage ?? fallbackImage}
      alt=""
      fill
      priority
      sizes="100vw"
      unoptimized={Boolean(remoteImage)}
      onError={remoteImage ? () => setFailed(true) : undefined}
      className="object-cover object-center"
    />
  );
}
