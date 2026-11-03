import { Headset } from "lucide-react";
import Image from "next/image";

import LoginForm from "./_components/LoginForm";

export default function AdminLoginPage() {
  const supportEmail = process.env.NEXT_PUBLIC_OPS_SUPPORT_EMAIL;
  const supportLabel = (
    <>
      <Headset aria-hidden="true" className="size-3" />
      Contact Ops Support
    </>
  );
  const supportClassName = "inline-flex items-center gap-1 font-semibold text-[#9d4300]";

  return (
    <div className="relative isolate flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-[#131b2e] px-3 py-6 font-sans text-[#191c1e] sm:px-6 sm:py-10">
      <Image src="/admin-login/mountains.png" alt="" fill sizes="100vw" priority className="object-cover" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#131b2e]/95 via-[#131b2e]/85 to-[#131b2e]/70 mix-blend-multiply" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#131b2e] via-transparent to-[#131b2e]/50" />

      <section
        aria-labelledby="login-heading"
        className="relative flex w-full min-w-0 max-w-[416px] flex-col gap-5 rounded-xl border border-[#e0e3e5]/40 bg-white/95 p-5 shadow-2xl backdrop-blur-[40px] sm:gap-6 sm:p-10"
      >
        <header className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-xl bg-[#0f172a] px-5 py-3">
            <Image
              src="/admin-login/logo.png"
              alt="Rocklizard Adventure"
              width={140}
              height={64}
              className="h-auto w-[120px] sm:w-[140px]"
            />
          </div>
          <h1 id="login-heading" className="text-2xl leading-8 font-bold tracking-[-0.6px]">
            Dashboard Login
          </h1>
          <p className="mt-1 text-sm leading-5 text-[#45464d]">
            Sign in to manage expeditions, bookings, and operations
          </p>
        </header>

        <LoginForm />

        <div className="space-y-1 border-t border-[#e0e3e5]/50 pt-4 text-center text-sm leading-5 text-[#45464d]">
          <p>Need system access or technical assistance?</p>
          {supportEmail ? (
            <a href={`mailto:${supportEmail}`} className={`${supportClassName} underline-offset-4 hover:underline`}>
              {supportLabel}
            </a>
          ) : (
            <span className={supportClassName}>{supportLabel}</span>
          )}
        </div>
      </section>
    </div>
  );
}
