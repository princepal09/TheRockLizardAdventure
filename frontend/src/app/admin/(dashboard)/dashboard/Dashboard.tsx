"use client";

import { useAuthInit } from "@/stores/useAuthInit";

export default function Dashboard() {
  const { data: admin } = useAuthInit();

  return (
    <section
      aria-labelledby="dashboard-heading"
      className="mx-auto w-full max-w-6xl space-y-2"
    >
      <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
        Workspace
      </p>
      <h1
        id="dashboard-heading"
        className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
      >
        Dashboard overview
      </h1>
      {admin?.email && (
        <p className="text-sm break-all text-slate-600">
          Signed in as {admin.email}
        </p>
      )}
    </section>
  );
}
