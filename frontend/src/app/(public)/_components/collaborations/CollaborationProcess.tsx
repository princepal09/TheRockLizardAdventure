import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Introduce your organisation",
    description:
      "Share your company or NGO’s name, location in North India, programme goals, group size and preferred dates.",
  },
  {
    title: "Shape the programme",
    description:
      "Discuss suitable routes, participant needs, timing and local arrangements with our Almora team.",
  },
  {
    title: "Agree on a shared plan",
    description:
      "Confirm feasibility, responsibilities, costs and the programme details together before making a commitment.",
  },
];

export default function CollaborationProcess() {
  return (
    <section
      aria-labelledby="collaboration-process-title"
      className="bg-[#eef5f8] px-4 py-10 sm:px-6 sm:py-14 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] font-bold tracking-widest text-sky-800 uppercase">
          From an idea to a shared plan
        </p>
        <h2
          id="collaboration-process-title"
          className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-5xl"
        >
          How We Can Work Together
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map(({ title, description }, index) => (
            <li key={title} className="rounded-xl border border-sky-100 bg-white p-5">
              <p aria-hidden="true" className="font-mono text-xs font-bold text-orange-800">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 p-5 text-white">
          <div>
            <h3 className="text-base font-bold">Have a collaboration in mind?</h3>
            <p className="mt-1 text-sm text-slate-300">
              Let’s discuss what your organisation wants to create.
            </p>
          </div>
          <Link
            href="/contact?topic=collaboration#enquiry-form"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Collaborate With Us <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
