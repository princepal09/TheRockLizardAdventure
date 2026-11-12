import ScrollReveal from "../ScrollReveal";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getCachedPublicTeam } from "@/lib/api/public-team";

import TeamMemberCard from "./TeamMemberCard";

const profilesClass = "flex flex-wrap items-start justify-center gap-5 lg:gap-6";
const profileWidthClass =
  "w-full min-w-0 max-w-sm sm:w-[calc((100%_-_1.25rem)/2)] lg:w-[calc((100%_-_3rem)/3)]";

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
    <div className="space-y-5">
      <p className="text-center text-sm font-semibold text-slate-700">
        <span className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 tabular-nums">
          {members.length} {members.length === 1 ? "team member" : "team members"}
        </span>
      </p>
      <ul className={profilesClass}>
        {members.map((member) => (
          <li key={member.id} className={profileWidthClass}>
            <TeamMemberCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutTeam() {
  return (
    <ScrollReveal
      as="section"
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
              <div aria-hidden="true" className="space-y-5">
                <Skeleton className="mx-auto h-[30px] w-28 rounded-full bg-slate-200" />
                <div className={profilesClass}>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className={`${profileWidthClass} flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-5 py-7 sm:py-8`}
                    >
                      <Skeleton className="size-36 rounded-full bg-slate-200 sm:size-44" />
                      <Skeleton className="mt-6 h-8 w-3/4 bg-slate-200 sm:h-9" />
                      <Skeleton className="mt-1 h-5 w-1/2 bg-slate-200" />
                      <Skeleton className="mt-5 h-9 w-28 rounded-full bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <TeamProfiles />
        </Suspense>
      </div>
    </ScrollReveal>
  );
}
