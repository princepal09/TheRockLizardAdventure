import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Share your group brief",
    description:
      "Tell us who you’re planning for, your preferred dates, group size, and the group’s trekking or climbing experience.",
  },
  {
    title: "Discuss the route",
    description:
      "Review the itinerary, pacing, and the local arrangements your trip needs with the Almora team.",
  },
  {
    title: "Agree on the details",
    description:
      "Confirm availability, inclusions, responsibilities, and a quote for your group before committing to dates.",
  },
];

export default function PartnershipProcess() {
  return (
    <section
      aria-labelledby="trade-process-heading"
      className="bg-[#eef5f8] px-4 py-10 sm:px-6 sm:py-14 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] font-bold tracking-widest text-sky-800 uppercase">
          From brief to departure
        </p>
        <h2
          id="trade-process-heading"
          className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-5xl"
        >
          How We Work Together
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map(({ title, description }, index) => (
            <li
              key={title}
              className="rounded-xl border border-sky-100 bg-white p-5"
            >
              <p
                aria-hidden="true"
                className="font-mono text-xs font-bold text-orange-800"
              >
                0{index + 1}
              </p>
              <h3 className="mt-2 text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 p-5 text-white">
          <div>
            <h3 className="text-base font-bold">
              Have a group or route in mind?
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Send your brief to the Almora team to start the conversation.
            </p>
          </div>
          <Link
            href="/contact?topic=travel-trade#enquiry-form"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Talk to the Trade Team{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
