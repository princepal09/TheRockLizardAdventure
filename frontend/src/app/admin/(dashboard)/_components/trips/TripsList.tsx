"use client";

import Link from "next/link";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTrips } from "@/hooks/trips/useTrips";
import type { TripKind } from "@/types/trip";
import { getErrorMessage } from "@/utils/error";
import { Plus } from "lucide-react";

export default function TripsList({ kind }: { kind: TripKind }) {
  const trips = useTrips(kind);
  const label = kind === "treks" ? "Trek" : "Expedition";

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
            Trips
          </p>
          <h1 className="text-3xl font-bold text-primary">{label}s</h1>
          <p className="text-sm text-slate-600">
            Manage {label.toLowerCase()} details, itineraries, and photos.
          </p>
        </div>
        <Link
          href={`/admin/${kind}/new`} style={{color:"white"}}
          className={`${buttonVariants({ variant: "secondary", size: "lg" })} gap-2 shadow-md transition-all hover:bg-secondary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
        >
          <Plus className="size-5 stroke-[2.5]" />
          <span>New {label}</span>
        </Link>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {trips.isPending ? (
          <ModuleSkeleton label={`Loading ${kind}`} />
        ) : trips.isError ? (
          <div className="space-y-3 p-5">
            <p role="alert" className="text-red-800">
              {getErrorMessage(trips.error)}
            </p>
            <Button
              variant="outline"
              disabled={trips.isFetching}
              onClick={() => void trips.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : trips.data.length ? (
          <ul className="divide-y divide-slate-200">
            {trips.data.map((trip) => (
              <li key={trip.id}>
                <Link
                  href={`/admin/${kind}/${trip.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-4 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="font-semibold break-words text-primary">
                      {trip.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {trip.durationDays} days ·{" "}
                      {trip.difficulty.toLowerCase().replaceAll("_", " ")}
                    </p>
                  </div>
                  <span className="rounded-full bg-tertiary/20 px-2.5 py-1 text-xs font-semibold text-primary capitalize">
                    {trip.status.toLowerCase()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-slate-600">No {kind} yet.</p>
        )}
      </div>
    </section>
  );
}
