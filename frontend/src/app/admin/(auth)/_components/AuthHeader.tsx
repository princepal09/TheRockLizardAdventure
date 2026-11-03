import { UserRound } from "lucide-react";
import Image from "next/image";

export default function AuthHeader() {
  return (
    <header className="border-b border-slate-200 bg-white text-primary">
      <div className="mx-auto flex min-h-[70px] max-w-[1440px] items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="shrink-0 rounded-lg bg-[#0f172a] px-2 py-1.5">
            <Image
              src="/admin-login/logo.png"
              alt=""
              width={70}
              height={32}
              className="h-auto w-14 sm:w-[70px]"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs leading-tight font-extrabold uppercase sm:text-sm">
              Rock Lizard Adventure
            </p>
            <p className="hidden font-mono text-[10px] tracking-[0.18em] text-slate-600 uppercase sm:block">
              Expedition Management System
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-sky-800 uppercase sm:inline-flex">
            <span aria-hidden="true" className="size-2 rounded-full bg-sky-500" />
            Basecamp Console
          </span>

          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <UserRound className="size-4" />
          </span>
        </div>
      </div>
    </header>
  );
}
