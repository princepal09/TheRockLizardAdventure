import { ChevronDown } from "lucide-react";
import type { TeamMember } from "@/types/team";

import TeamPhoto from "./TeamPhoto";

const cardClass =
  "min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm";
const profileClass = "flex flex-col items-center px-5 py-7 text-center sm:py-8";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const hasDetails = Boolean(member.bio?.trim() || member.qualifications?.trim());
  const profile = (
    <>
      <div className="rounded-full ring-1 ring-sky-200 ring-offset-4 ring-offset-white group-open:ring-[#ff5722] group-open:ring-offset-slate-900">
        <TeamPhoto key={member.photoUrl} name={member.name} src={member.photoUrl} />
      </div>
      <h3 className="mt-6 font-heading text-2xl leading-tight font-bold tracking-tight wrap-anywhere sm:text-3xl">
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-medium wrap-anywhere text-sky-800 group-open:text-orange-200">
        {member.role}
      </p>
    </>
  );

  if (!hasDetails) {
    return <article className={`${cardClass} ${profileClass}`}>{profile}</article>;
  }

  return (
    <details
      className={`${cardClass} group open:border-slate-900 open:bg-slate-900 open:text-white`}
    >
      <summary
        className={`${profileClass} cursor-pointer list-none hover:bg-sky-50/60 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-sky-500 group-open:hover:bg-slate-800 [&::-webkit-details-marker]:hidden`}
      >
        {profile}
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-900 group-open:border-slate-600 group-open:bg-slate-800 group-open:text-orange-200">
          <span className="group-open:hidden">View profile</span>
          <span className="hidden group-open:inline">Hide profile</span>
          <ChevronDown aria-hidden="true" className="size-4 group-open:rotate-180" />
        </span>
      </summary>
      <div className="space-y-4 border-t border-slate-700 px-6 py-5 text-sm leading-relaxed wrap-anywhere text-slate-200">
        {member.bio?.trim() && <p className="whitespace-pre-line">{member.bio}</p>}
        {member.qualifications?.trim() && (
          <div>
            <h4 className="mb-1 font-semibold text-orange-200">Qualifications</h4>
            <p className="whitespace-pre-line">{member.qualifications}</p>
          </div>
        )}
      </div>
    </details>
  );
}
