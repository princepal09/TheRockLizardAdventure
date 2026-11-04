import { ArrowUpRight, Compass, MountainSnow } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";

const partners = [
  {
    name: "Giripremi Adventure Foundation",
    icon: "/b2b/gaf.svg",
    description:
      "A Pune-based trekking and expedition organisation offering Himalayan and Sahyadri treks alongside international expeditions.",
    website: "https://gafindia.in/",
    tone: "bg-slate-900",
  },
  {
    name: "Guardian Giripremi Institute of Mountaineering",
    icon: MountainSnow,
    description:
      "A Pune-based mountaineering institute with courses in rock climbing, high-altitude mountaineering, and outdoor leadership.",
    website: "https://ggim.in/",
    tone: "bg-sky-100 text-sky-900",
  },
  {
    name: "WildHeart Explores",
    icon: Compass,
    description:
      "An adventure partner in Rock Lizard’s network for group treks and outdoor experiences.",
    website: "",
    tone: "bg-emerald-100 text-emerald-900",
  },
];

export default function PartnerShowcase() {
  return (
    <section
      id="trade-partners"
      aria-labelledby="trade-partners-heading"
      className="scroll-mt-6 border-b border-stone-200 px-4 py-10 sm:px-6 sm:py-14 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          Our Partner Network
        </p>
        <h2
          id="trade-partners-heading"
          className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Meet Our Adventure Partners
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Organisations Rock Lizard Adventure works with.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map(({ name, icon: Icon, description, website, tone }) => (
            <li key={name} className="min-w-0">
              <Card className="h-full gap-3 border border-stone-200 bg-[#fffefa] p-5 ring-0!">
                <span
                  aria-hidden="true"
                  className={`grid size-12 place-items-center rounded-xl ${tone}`}
                >
                  {typeof Icon === "string" ? (
                    <Image
                      src={Icon}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 object-contain"
                    />
                  ) : (
                    <Icon className="size-6" />
                  )}
                </span>
                <h3 className="font-heading text-2xl leading-tight font-bold">
                  {name}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
                {website ? (
                  <a
                    target="_blank"
                    href={website}
                    aria-label={`${name} official website`}
                    className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-bold text-sky-800 hover:underline"
                  >
                    Official Website{" "}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </a>
                ) : (
                  <span className="mt-auto text-xs text-slate-500">
                    Official website coming soon
                  </span>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
