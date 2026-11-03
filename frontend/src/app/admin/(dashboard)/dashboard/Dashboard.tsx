"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthInit } from "@/stores/useAuthInit";
import { getErrorMessage } from "@/utils/error";

export default function Dashboard() {
  const { data: admin } = useAuthInit();
  const logout = useLogout();

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Signed in as {admin?.email}</p>
      <Button disabled={logout.isPending} onClick={() => logout.mutate()}>
        {logout.isPending ? "Signing out…" : "Sign out"}
      </Button>
      {logout.isError && <p role="alert">{getErrorMessage(logout.error)}</p>}
    </main>
  );
}
