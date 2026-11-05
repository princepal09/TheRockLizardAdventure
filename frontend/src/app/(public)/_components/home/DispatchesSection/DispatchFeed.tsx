"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import DispatchCard from "./DispatchCard";
import { featuredDispatch, trekkingArticles } from "@/types/dispatches";

const filters = ["Latest Updates", "Trekking Articles"] as const;

export default function DispatchFeed() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Latest Updates");

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-widest text-sky-700 uppercase">
            Almora Editorial Desk
          </p>
          <h2
            id="dispatches-heading"
            className="section-heading-accent mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Dispatches from the Ridgeline
          </h2>
        </div>
        <div role="group" aria-label="Filter dispatches" className="flex flex-wrap gap-1.5">
          {filters.map((label) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
              className="rounded-full border-stone-200 bg-white px-3 text-xs text-slate-700 aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-[#ffffff]"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div
        className={
          filter === "Latest Updates" ? "grid gap-4 md:grid-cols-[1.4fr_1fr] lg:gap-6" : undefined
        }
      >
        {filter === "Latest Updates" && <DispatchCard dispatch={featuredDispatch} featured />}
        <div
          className={
            filter === "Latest Updates"
              ? "flex flex-col gap-2 justify-between"
              : "grid gap-3 lg:grid-cols-3"
          }
        >
          {trekkingArticles.map((dispatch) => (
            <DispatchCard key={dispatch.title} dispatch={dispatch} />
          ))}
        </div>
      </div>
    </>
  );
}
