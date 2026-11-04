import {
  BriefcaseMedical,
  Handshake,
  Leaf,
  ShieldCheck,
  Utensils,
} from "lucide-react";

import StandardPillarCard from "./StandardPillarCard";

const pillars = [
  {
    Icon: BriefcaseMedical,
    label: "Trail protocol",
    title: "Safety on the Trail",
    description:
      "Route briefings cover terrain, pacing, and group communication. The expedition lead can walk you through the planned check-ins and descent options for your itinerary before departure.",
    tags: ["Route briefings", "Group check-ins", "Descent planning"],
    tone: "sky",
    wide: true,
  },
  {
    Icon: Utensils,
    label: "Camp nutrition",
    title: "Fresh Pahadi Meals",
    description:
      "Camp menus draw on Pahadi staples such as mandua and gahat. Share your dietary needs before departure so Basecamp can confirm what the kitchen can accommodate.",
    tags: ["Local grains", "Camp meals"],
    tone: "orange",
    wide: false,
  },
  {
    Icon: Handshake,
    label: "Ethical labor",
    title: "Fair Wages & Porter Dignity",
    description:
      "Porters and camp crews make these journeys possible. Fair pay, manageable loads, and suitable equipment are part of how we think about responsible expedition planning.",
    tags: ["Fair pay", "Load planning"],
    tone: "sky",
    wide: false,
  },
  {
    Icon: Leaf,
    label: "Conservation",
    title: "Leave No Trace in Uttarakhand",
    description:
      "Pack out waste, choose reusable gear where practical, and leave campsites and water sources as you found them. Small decisions on each departure help protect the routes we share.",
    tags: [
      "Pack out waste",
      "Reduce single-use plastics",
      "Protect water sources",
    ],
    tone: "orange",
    wide: true,
  },
] as const;

export default function MountainStandard() {
  return (
    <section
      aria-labelledby="mountain-standard-heading"
      className="border-y border-sky-100 bg-[#f3f7f9] px-4 py-10 sm:px-6 sm:py-14 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-7 max-w-xl text-center sm:mb-9">
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
            <ShieldCheck aria-hidden="true" className="size-3.5" /> Our
            operating principles
          </p>
          <h2
            id="mountain-standard-heading"
            className="section-heading-accent section-heading-accent--center mt-2 font-heading text-3xl leading-tight font-bold tracking-tight sm:text-5xl"
          >
            The Rock Lizard Mountain Standard
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Four priorities guide how we plan trips in the Himalayas, from the
            first route briefing to the last campsite.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
          {pillars.map(({ wide, ...pillar }, index) => (
            <StandardPillarCard
              key={pillar.label}
              {...pillar}
              number={index + 1}
              className={wide ? "md:col-span-7" : "md:col-span-5"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
