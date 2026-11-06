"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { getPublishedPickerTreks } from "@/lib/api/trek-picker";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const formId = useId();
  const currentTerm = input.trim().toLowerCase();
  const showResults = open && currentTerm.length >= 2;
  const waiting = currentTerm !== term;

  useEffect(() => {
    if (mobileExpanded) inputRef.current?.focus();
  }, [mobileExpanded]);

  useEffect(() => {
    const timer = window.setTimeout(() => setTerm(currentTerm), 250);
    return () => window.clearTimeout(timer);
  }, [currentTerm]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["public", "header-treks"],
    queryFn: ({ signal }) => getPublishedPickerTreks(signal),
    enabled: showResults && !waiting,
  });

  const matches = useMemo(() => {
    if (term.length < 2 || !data) return [];
    const results = [];
    for (const trek of data) {
      if (trek.name.toLowerCase().includes(term)) results.push(trek);
      if (results.length === 6) break;
    }
    return results;
  }, [data, term]);

  return (
    <div
      className="relative flex justify-end sm:block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setMobileExpanded(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && (showResults || mobileExpanded)) {
          event.preventDefault();
          setOpen(false);
          setMobileExpanded(false);
          window.requestAnimationFrame(() => {
            if (triggerRef.current?.getClientRects().length) triggerRef.current.focus();
          });
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open trek search"
        aria-expanded={mobileExpanded}
        aria-controls={formId}
        onClick={() => setMobileExpanded(true)}
        className={`${mobileExpanded ? "hidden" : "grid"} size-11 shrink-0 place-items-center rounded-full text-slate-100 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-sky-400 sm:hidden`}
      >
        <Search aria-hidden="true" className="size-5" />
      </button>
      <form
        id={formId}
        action="/treks"
        onSubmit={(event) => {
          if (!currentTerm) event.preventDefault();
        }}
        role="search"
        aria-label="Header trek search"
        className={`${mobileExpanded ? "flex" : "hidden"} w-full items-center gap-1 rounded-full border border-gray-800/80 bg-[#131b2e]/90 px-2 py-2 text-gray-300 shadow-inner focus-within:border-sky-500 sm:flex sm:gap-2 sm:px-4`}
      >
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={input}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setInput(event.target.value);
            setOpen(true);
          }}
          maxLength={100}
          aria-label="Search treks by name"
          placeholder="Search treks: Uttarakhand (Kumaon + Garhwal), Kashmir, Himachal..."
          className="min-w-0 flex-1 truncate bg-transparent text-xs tracking-wide text-white placeholder:text-gray-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!currentTerm}
          aria-label="Search treks"
          className="grid size-7 shrink-0 place-items-center rounded-full text-gray-400 enabled:hover:text-sky-400 focus-visible:outline-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search aria-hidden="true" className="size-4" />
        </button>
      </form>
      {showResults && (
        <div className="fixed inset-x-4 top-[calc(var(--public-header-height,4.5rem)+0.5rem)] z-30 rounded-xl border border-slate-700 bg-[#131b2e] p-2 text-sm text-slate-100 shadow-xl sm:absolute sm:inset-x-0 sm:top-full sm:mt-2">
          {waiting || isPending ? (
            <p role="status" className="px-3 py-2 text-slate-300">
              Searching…
            </p>
          ) : isError ? (
            <p role="status" className="px-3 py-2 text-slate-300">
              Couldn’t load trek matches.
            </p>
          ) : matches.length ? (
            <ul aria-label="Matching treks">
              {matches.map(({ id, name, slug }) => (
                <li key={id}>
                  <Link
                    href={`/treks/${encodeURIComponent(slug)}`}
                    prefetch={false}
                    onNavigate={() => {
                      setInput("");
                      setTerm("");
                      setOpen(false);
                      setMobileExpanded(false);
                    }}
                    className="block rounded-md px-3 py-2 hover:bg-slate-800 focus-visible:bg-slate-800"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="px-3 py-2 text-slate-300">
              No matching treks.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
