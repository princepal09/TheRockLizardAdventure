import type { Metadata } from "next";
import { Suspense } from "react";
import ModuleSkeleton from "@/components/ui/ModuleSkeleton";

import PasswordRecoveryForm from "@/app/admin/(auth)/_components/PasswordRecoveryForm";
import PasswordRecoveryLayout from "@/app/admin/(auth)/_components/PasswordRecoveryLayout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

async function ResetPasswordForm({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return <PasswordRecoveryForm token={typeof token === "string" ? token : ""} />;
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <main className="flex min-h-dvh flex-col">
      <PasswordRecoveryLayout>
        <Suspense fallback={<ModuleSkeleton label="Loading reset form" variant="form" />}>
          <ResetPasswordForm searchParams={searchParams} />
        </Suspense>
      </PasswordRecoveryLayout>
    </main>
  );
}
