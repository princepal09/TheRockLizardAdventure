import Image from "next/image";
import type { ReactNode } from "react";

export default function PasswordRecoveryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-[#131b2e] px-4 py-10 sm:px-6 sm:py-16">
      <Image
        src="/admin-login/image3.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#131b2e]/95 via-[#131b2e]/85 to-[#131b2e]/55"
      />
      <div className="relative w-full max-w-[416px] rounded-2xl border border-white/50 bg-white/95 text-[#191c1e] shadow-2xl backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}
