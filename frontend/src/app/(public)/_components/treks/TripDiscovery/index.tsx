import { getPublishedRoadTrips } from "@/lib/api/published-road-trips";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedExpeditions } from "@/lib/api/published-expeditions";
import { getPublishedTreks } from "@/lib/api/published-treks";
import type { TripKind } from "@/types/trip";

import TripDiscoveryResults from "./TripDiscoveryResults";

type Props = {
  kind: TripKind;
  searchParams: Promise<{ q?: string | string[] }>;
};

async function TripDiscoveryContent({ kind, searchParams }: Props) {
  const load =
    kind === "treks"
      ? getPublishedTreks
      : kind === "trips"
        ? getPublishedRoadTrips
        : getPublishedExpeditions;
  const [{ q }, trips] = await Promise.all([searchParams, load().catch(() => null)]);
  if (!trips)
    return (
      <p role="alert" className="text-sm text-slate-700">
        Couldn’t load {kind}. Refresh to try again.
      </p>
    );
  const query = (Array.isArray(q) ? q[0] : q)?.slice(0, 100).trim() ?? "";

  return <TripDiscoveryResults key={query} kind={kind} trips={trips} query={query} />;
}

export default function TripDiscovery(props: Props) {
  return (
    <section className="space-y-6 bg-[#f2f7fa] px-4 py-8 text-slate-900 sm:px-6 xl:px-10">
      <h2 className="section-heading-accent section-heading-accent--center text-center font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {props.kind === "trips"
          ? "Find Your Next Road or Bike Journey"
          : "Filter by Your Mountain Calling"}
      </h2>
      <Suspense
        fallback={
          <div role="status" className="space-y-4">
            <span className="sr-only">Loading {props.kind}…</span>
            <Skeleton className="mx-auto h-8 w-full max-w-lg bg-slate-200" />
            <Skeleton className="h-20 w-full bg-slate-200" />
            <Skeleton className="h-80 w-full rounded-xl bg-slate-200" />
          </div>
        }
      >
        <TripDiscoveryContent {...props} />
      </Suspense>
    </section>
  );
}
