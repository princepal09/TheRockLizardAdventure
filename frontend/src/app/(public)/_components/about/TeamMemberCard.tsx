import { Compass } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/types/team";

import TeamPhoto from "./TeamPhoto";

export default function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <Card className="group grid min-w-0 grid-cols-1 gap-0! overflow-hidden rounded-2xl border border-slate-200 bg-white py-0! text-slate-900 shadow-sm ring-0! md:grid-cols-2">
      <div className={`relative min-w-0 ${reverse ? "md:order-2" : ""}`}>
        <TeamPhoto
          key={member.photoUrl}
          name={member.name}
          src={member.photoUrl}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/55 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 rounded-lg border border-white/25 bg-slate-950/65 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm sm:bottom-5 sm:left-5"
        >
          Almora Crew · {number}
        </span>
      </div>
      <div
        className={`relative flex min-w-0 flex-col justify-center overflow-hidden p-6 sm:p-9 lg:p-12 ${reverse ? "bg-[#fff8ef]" : "bg-[#f8fbfd]"}`}
      >
        <Compass
          aria-hidden="true"
          className="pointer-events-none absolute -top-5 -right-5 size-36 text-slate-900/5 sm:size-44"
        />
        <div className="relative max-w-xl">
          <p
            className={`flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase ${reverse ? "text-orange-800" : "text-sky-800"}`}
          >
            <span aria-hidden="true" className="h-px w-6 bg-current" />
            {member.role}
          </p>
          <h3 className="mt-3 font-heading text-3xl leading-none font-bold tracking-tight break-words sm:text-4xl lg:text-5xl">
            {member.name}
          </h3>
          {member.bio && (
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-line break-words text-slate-600 sm:text-base">
              {member.bio}
            </p>
          )}
          {member.qualifications && (
            <div className="mt-5 border-t border-slate-200 pt-3 text-sm leading-relaxed whitespace-pre-line break-words text-slate-700">
              <p className="mb-1 font-mono text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                Qualifications
              </p>
              {member.qualifications}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
