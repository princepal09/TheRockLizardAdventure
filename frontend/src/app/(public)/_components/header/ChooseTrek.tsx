"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrekPickerData } from "@/lib/api/trek-picker";
import type { Season } from "@/types/trip-option";

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
});
const months = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: monthFormatter.format(new Date(Date.UTC(2000, index, 1))),
}));

type Filter = { kind: "month" | "region" | "season"; id: string };

function includesMonth({ startMonth, endMonth }: Season, month: number) {
  if (startMonth === null || endMonth === null) return false;
  return startMonth <= endMonth
    ? month >= startMonth && month <= endMonth
    : month >= startMonth || month <= endMonth;
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0 border-t border-slate-200 p-4 sm:px-6 xl:border-t-0 xl:border-l xl:first:border-l-0">
      <h3 className="mb-3 border-b border-slate-200 pb-3 font-mono text-xs font-semibold tracking-widest text-slate-600 uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function OptionSkeletons({ count }: { count: number }) {
  return (
    <div aria-hidden="true" className="space-y-1">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-2 px-2.5 py-2"
        >
          <Skeleton className="h-4 w-2/3 bg-slate-200" />
          <Skeleton className="size-3 shrink-0 bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function Option({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600 aria-pressed:bg-sky-100 aria-pressed:text-sky-900"
    >
      <span>{label}</span>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-slate-400"
      />
    </button>
  );
}

function TrekPicker({ onNavigate }: { onNavigate: () => void }) {
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState<Filter | null>(null);
  const query = useQuery({
    queryKey: ["public", "trek-picker"],
    queryFn: ({ signal }) => getTrekPickerData(signal),
  });
  const { data } = query;
  const { regions = [], seasons = [] } = data ?? {};

  useEffect(() => {
    const timer = window.setTimeout(
      () => setTerm(search.trim().toLowerCase()),
      250,
    );
    return () => window.clearTimeout(timer);
  }, [search]);

  const matches = useMemo(
    () =>
      data?.treks.filter((trek) => {
        if (!trek.name.toLowerCase().includes(term)) return false;
        if (!filter) return true;
        if (filter.kind === "region") return trek.regionId === filter.id;
        if (filter.kind === "season")
          return trek.seasons.some(({ seasonId }) => seasonId === filter.id);

        const month = Number(filter.id);
        if (trek.months.length)
          return trek.months.some((entry) => entry.month === month);
        return data.seasons.some(
          (season) =>
            trek.seasons.some(({ seasonId }) => seasonId === season.id) &&
            includesMonth(season, month),
        );
      }) ?? [],
    [data, filter, term],
  );

  return (
    <div className="min-h-0 overflow-y-auto overscroll-contain">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        <Column title="Trek by name">
          <label className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:ring-2 focus-within:ring-sky-600">
            <span className="sr-only">Search treks by name</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search treks by name"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
            />
            <Search
              aria-hidden="true"
              className="size-4 shrink-0 text-slate-500"
            />
          </label>
          {filter && (
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="mb-2 px-2.5 text-sm text-sky-800 underline"
            >
              Clear filter
            </button>
          )}
          {query.isPending && (
            <>
              <p role="status" className="sr-only">
                Loading treks, regions, and seasons…
              </p>
              <OptionSkeletons count={6} />
            </>
          )}
          {query.isError && (
            <div className="px-2.5 text-sm text-slate-700">
              <p role="alert">Couldn’t load treks.</p>
              <button
                type="button"
                onClick={() => void query.refetch()}
                className="mt-2 underline"
                disabled={query.isFetching}
              >
                Try again
              </button>
            </div>
          )}
          {query.isSuccess && !matches.length && (
            <p role="status" className="px-2.5 text-sm text-slate-600">
              No matching treks.
            </p>
          )}
          {matches.map((trek) => (
            <Link
              key={trek.id}
              href={`/treks/${encodeURIComponent(trek.slug)}`}
              onNavigate={onNavigate}
              prefetch={false}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600"
            >
              <span>{trek.name}</span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-slate-400"
              />
            </Link>
          ))}
        </Column>
        {(
          [
            { kind: "month", title: "Months", options: months },
            { kind: "region", title: "Region", options: regions },
            { kind: "season", title: "Season", options: seasons },
          ] as const
        ).map(({ kind, title, options }) => (
          <Column key={kind} title={title}>
            {query.isPending && kind !== "month" && (
              <OptionSkeletons count={4} />
            )}
            {query.isSuccess && !options.length && (
              <p className="px-2.5 text-sm text-slate-600">
                No options available.
              </p>
            )}
            {options.map(({ id, name }) => {
              const selected = filter?.kind === kind && filter.id === id;
              return (
                <Option
                  key={id}
                  label={name}
                  selected={selected}
                  onClick={() => setFilter(selected ? null : { kind, id })}
                />
              );
            })}
          </Column>
        ))}
      </div>
    </div>
  );
}

export default function ChooseTrek({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);

  function cancelHover() {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = undefined;
  }

  useEffect(() => {
    return () => window.clearTimeout(hoverTimer.current);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        onPointerMove={(event) => {
          if (event.pointerType === "mouse" && !open && hoverTimer.current === undefined) {
            hoverTimer.current = window.setTimeout(() => {
              hoverTimer.current = undefined;
              setOpen(true);
            }, 200);
          }
        }}
        onPointerLeave={cancelHover}
        onClick={cancelHover}
        className="flex items-center gap-2 rounded-lg bg-[#ff5722] px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-[#f4511e] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Choose Trek <ChevronDown aria-hidden="true" className="size-4" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-60 bg-black/55" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-70 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-7xl -translate-1/2 flex-col overflow-hidden rounded-xl bg-white text-slate-900 shadow-xl">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2 sm:px-6">
            <Dialog.Title className="font-heading text-xl font-semibold">
              Choose a trek
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close trek picker"
              className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
            >
              <X aria-hidden="true" />
            </Dialog.Close>
          </div>
          <TrekPicker
            onNavigate={() => {
              setOpen(false);
              onNavigate?.();
            }}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
