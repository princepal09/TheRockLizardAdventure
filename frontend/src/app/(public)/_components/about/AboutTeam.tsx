import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getCachedPublicTeam } from "@/lib/api/public-team";

import TeamMemberCard from "./TeamMemberCard";

async function TeamProfiles() {
  const members = await getCachedPublicTeam().catch(() => null);
  if (!members)
    return (
      <p
        role="status"
        className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
      >
        Team profiles are temporarily unavailable.
      </p>
    );
  if (!members.length)
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Team profiles will appear here when published.
      </p>
    );

  return (
    <ul className="space-y-6 md:space-y-9">
      {members.map((member, index) => (
        <li key={member.id} className="min-w-0">
          <TeamMemberCard member={member} index={index} />
        </li>
      ))}
    </ul>
  );
}

export default function AboutTeam() {
  return (
    <section
      id="about-team"
      aria-labelledby="about-team-heading"
      className="scroll-mt-20 border-t border-sky-100 bg-[#eef5f8]"
    >
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-10 sm:px-6 sm:py-14 md:space-y-9 xl:px-10">
        <div className="border-b border-sky-200/80 pb-5">
          <p className="font-mono text-[10px] font-bold tracking-widest text-sky-800 uppercase">
            The people behind the routes
          </p>
          <h2
            id="about-team-heading"
            className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Meet the Custodians of the Trail
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Get to know the crew behind route planning, departure logistics, and time on the trail.
          </p>
        </div>
        <Suspense
          fallback={
            <div role="status">
              <span className="sr-only">Loading team profiles…</span>
              <div aria-hidden="true" className="space-y-6 md:space-y-9">
                {[false, true].map((reverse, index) => (
                  <div
                    key={index}
                    className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2"
                  >
                    <Skeleton
                      className={`aspect-[5/4] rounded-none bg-slate-200 md:min-h-[23rem] md:aspect-auto ${reverse ? "md:order-2" : ""}`}
                    />
                    <div className="flex flex-col justify-center gap-4 p-6 sm:p-9">
                      <Skeleton className="h-3 w-28 bg-slate-200" />
                      <Skeleton className="h-10 w-3/4 bg-slate-200" />
                      <Skeleton className="h-12 w-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <TeamProfiles />
        </Suspense>
      </div>
    </section>
  );
}
