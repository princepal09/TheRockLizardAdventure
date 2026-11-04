import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getPublishedExpedition } from "@/lib/api/published-expeditions";

type Params = Promise<{ slug: string }>;

async function Brief({ params }: { params: Params }) {
  const { slug } = await params;
  const expedition = await getPublishedExpedition(slug);
  if (!expedition) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold">{expedition.name}</h1>
      {expedition.summary && (
        <p className="mt-3 text-slate-600">{expedition.summary}</p>
      )}
    </>
  );
}

export default function ExpeditionPage({ params }: { params: Params }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Suspense fallback={<p role="status">Loading expedition…</p>}>
        <Brief params={params} />
      </Suspense>
    </main>
  );
}
