import type { ReactNode } from "react";

import AuthFooter from "./_components/AuthFooter";
import AuthHeader from "./_components/AuthHeader";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AuthHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <AuthFooter />
    </div>
  );
}
