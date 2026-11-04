import { Compass, Mountain, UsersRound } from "lucide-react";
import Image from "next/image";

const principles = [
  {
    Icon: Compass,
    title: "Local knowledge",
    description: "Plan with a team based in Almora.",
  },
  {
    Icon: Mountain,
    title: "Route-first planning",
    description: "Match the itinerary to your group and experience.",
  },
  {
    Icon: UsersRound,
    title: "Direct coordination",
    description: "Talk to Basecamp before your departure.",
  },
];

export default function AboutStory() {
  return (
    <section
      aria-labelledby="about-story-heading"
      className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-12 xl:px-10"
    >
      <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800 shadow-sm lg:aspect-[1.1]">
        <Image
          src="/image2.jpeg"
          alt="Mountain landscape"
          fill
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/85 to-transparent px-5 pt-8 pb-4 font-mono text-[10px] font-bold tracking-widest text-white uppercase">
          The Himalayan landscape
        </figcaption>
      </figure>
      <div>
        <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          Our story
        </p>
        <h2
          id="about-story-heading"
          className="section-heading-accent mt-2 max-w-xl font-heading text-3xl leading-tight font-bold tracking-tight sm:text-5xl"
        >
          Built around the people who know these mountains
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Rock Lizard Adventure is based in Almora, Uttarakhand. Our work starts
          with a conversation about your group, your experience, and the kind of
          route you want to explore.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          The Basecamp team brings together route planning, guest coordination,
          and departure logistics, from short walks to longer Himalayan
          expeditions.
        </p>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
          {principles.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-stone-200 bg-white/85 p-3.5"
            >
              <Icon aria-hidden="true" className="size-4 text-orange-700" />
              <h3 className="mt-2 text-xs font-bold">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
