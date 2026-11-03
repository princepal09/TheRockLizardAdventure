import { LockKeyhole } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

async function CopyrightYear() {
  await connection();
  return <> {new Date().getFullYear()}</>;
}

export default function AuthFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-xs text-slate-600">
      <div className="mx-auto flex min-h-14 max-w-[1440px] flex-col items-center justify-center gap-2 px-4 py-3 text-center leading-relaxed sm:px-8 md:flex-row md:justify-between md:gap-4">
        <p className="flex items-center justify-center gap-1.5">
          <LockKeyhole aria-hidden="true" className="size-3.5 shrink-0 text-sky-600" />
          Secure SSL Encrypted Connection
        </p>
        <p className="text-center">
          ©<Suspense fallback={null}><CopyrightYear /></Suspense> Rock Lizard Adventure. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
