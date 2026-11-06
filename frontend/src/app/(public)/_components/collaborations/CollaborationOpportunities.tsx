import ScrollReveal from "../ScrollReveal";
import { Building2, HeartHandshake } from "lucide-react";
import Link from "next/link";

const opportunities = [
  {
    title: "Companies & teams",
    Icon: Building2,
    description:
      "Take your team beyond the meeting room. Discuss a group journey or outdoor experience shaped around your people and your goals.",
    ideas: [
      "Team offsites and group adventures",
      "Outdoor learning and shared experiences",
      "Private itineraries for your organisation",
    ],
    tone: "bg-sky-100 text-sky-900",
  },
  {
    title: "NGOs & community organisations",
    Icon: HeartHandshake,
    description:
      "Explore a collaboration with a clear purpose. Tell us about your participants, community or field programme so we can discuss practical ways to work together.",
    ideas: [
      "Field visits and group travel planning",
      "Youth and community outdoor programmes",
      "Nature awareness and responsible travel ideas",
    ],
    tone: "bg-emerald-100 text-emerald-900",
  },
];

export default function CollaborationOpportunities() {
  return (
    <ScrollReveal
      as="section"
      id="collaboration-opportunities"
      aria-labelledby="collaboration-opportunities-title"
      className="scroll-mt-24 border-b border-stone-200 px-4 py-10 sm:px-6 sm:py-14 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          Collaborate across North India
        </p>
        <h2
          id="collaboration-opportunities-title"
          className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Different organisations. Shared possibilities.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Tell us what you want to achieve. We’ll work through what is possible for your group,
          dates and destination before any programme is confirmed.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {opportunities.map(({ title, Icon, description, ideas, tone }) => (
            <li
              key={title}
              className="flex flex-col rounded-2xl border border-stone-200 bg-[#fffefa] p-5 sm:p-7"
            >
              <span
                aria-hidden="true"
                className={`grid size-12 place-items-center rounded-xl ${tone}`}
              >
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 marker:text-orange-600">
                {ideas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
              <Link
                href="/contact?topic=collaboration#enquiry-form"
                className="mt-5 inline-flex min-h-11 w-fit items-center font-semibold text-orange-800 underline underline-offset-4 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
              >
                Share your collaboration idea →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ScrollReveal>
  );
}
