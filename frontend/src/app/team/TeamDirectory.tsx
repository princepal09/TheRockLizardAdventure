"use client";

import { UserRound } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { usePublicTeam } from "@/hooks/team/useTeam";

export default function TeamDirectory() {
  const team = usePublicTeam();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Rock Lizard Adventure</p>
        <h1 className="font-heading text-4xl font-bold text-primary sm:text-5xl">Meet the Team</h1>
        <p className="max-w-xl text-slate-600">Get to know the people behind our treks and expeditions.</p>
      </header>
      {team.isPending ? (
        <p role="status" className="text-sm text-slate-600">Loading team members…</p>
      ) : team.isError ? (
        <div className="space-y-3">
          <p role="alert" className="text-sm text-red-800">We couldn&apos;t load the team. Please try again.</p>
          <Button variant="outline" onClick={() => void team.refetch()} disabled={team.isFetching}>Retry</Button>
        </div>
      ) : team.data.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.data.map((member) => (
            <li key={member.id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative grid aspect-[4/3] place-items-center bg-tertiary/15 text-primary">
                {member.photoUrl ? (
                  <Image src={member.photoUrl} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" unoptimized className="object-cover" />
                ) : <UserRound aria-hidden="true" className="size-10" />}
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h2 className="text-xl font-semibold break-words text-primary">{member.name}</h2>
                  <p className="text-sm font-medium break-words text-slate-600">{member.role}</p>
                </div>
                {member.bio && <p className="text-sm leading-6 break-words whitespace-pre-wrap text-slate-700">{member.bio}</p>}
                {member.qualifications && (
                  <div className="space-y-1 border-t border-slate-200 pt-3">
                    <h3 className="text-sm font-semibold text-primary">Qualifications</h3>
                    <p className="text-sm leading-6 break-words whitespace-pre-wrap text-slate-700">{member.qualifications}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-slate-600">Team profiles will be available soon.</p>}
    </main>
  );
}
