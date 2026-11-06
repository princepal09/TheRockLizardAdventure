import ScrollReveal from "../ScrollReveal";
import { Compass, MapPin, MessageSquare, Mountain } from "lucide-react";

const highlights = [
  { Icon: Mountain, label: "Basecamp", value: "Almora" },
  { Icon: MapPin, label: "Region", value: "Uttarakhand (Kumaon + Garhwal)" },
  { Icon: Compass, label: "Trip planning", value: "Treks & expeditions" },
  { Icon: MessageSquare, label: "Contact", value: "Direct enquiries" },
];

export default function ContactHero() {
  return (
    <ScrollReveal as="section" aria-labelledby="contact-heading" className="space-y-5">
      <div className="space-y-3">
        <p className="inline-flex rounded-full bg-slate-200/70 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-slate-700 uppercase">
          Almora Basecamp
        </p>
        <h1
          id="contact-heading"
          className="section-heading-accent max-w-2xl font-heading text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Talk Directly with Almora’s Mountain Desk
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Get in touch about a trek, a high-altitude expedition, or a private group itinerary. Our
          Almora team can help you plan the next step.
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-2 rounded-xl border border-stone-200 bg-white p-3 sm:grid-cols-4">
        {highlights.map(({ Icon, label, value }) => (
          <div key={label} className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 p-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-sky-50 text-sky-700">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <dt className="font-mono text-[9px] tracking-wide text-slate-600 uppercase">
                {label}
              </dt>
              <dd className="text-xs font-bold">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </ScrollReveal>
  );
}
