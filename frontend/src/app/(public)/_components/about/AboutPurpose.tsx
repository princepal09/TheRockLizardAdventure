import ScrollReveal from "../ScrollReveal";
import { ArrowUpRight, GraduationCap, Sprout } from "lucide-react";
import Link from "next/link";

const aims = [
  {
    title: "Encourage a sustainable way of life",
    description:
      "Build awareness of the balance in nature and encourage thoughtful everyday habits. Help young people balance digital life with meaningful time outdoors.",
  },
  {
    title: "Make room for healthy adventure",
    description:
      "Offer active, adventurous and recreational outdoor experiences that nurture curiosity, physical well-being and a sense of exploration, with discipline and enjoyment going hand in hand.",
  },
  {
    title: "Share mountain knowledge and skills",
    description:
      "Introduce basic rock climbing, high-altitude acclimatization and mountain etiquette, alongside an appreciation of hill culture and the region’s flora and fauna.",
  },
  {
    title: "Keep the Himalayas clean",
    description:
      "Encourage responsible waste practices, care for campsites and trails, and respect for forests. Make protecting the places we visit part of every outdoor experience.",
  },
  {
    title: "Put nature at the heart of adventure",
    description:
      "Promote adventure with respect for the environment, ecology and local communities. Inspire participants to become thoughtful visitors who value the landscapes and living systems around them.",
  },
  {
    title: "Build courage through challenge",
    description:
      "Give young people opportunities to experience nature, face unfamiliar situations and work through challenges together, developing resilience, patience, teamwork and self-belief.",
  },
  {
    title: "Inspire responsible volunteers",
    description:
      "Encourage a spirit of service, rescue awareness and readiness to help others. Support the development of responsible volunteers who understand teamwork and the importance of acting within their training.",
  },
];

export default function AboutPurpose() {
  return (
    <ScrollReveal
      as="section"
      aria-labelledby="about-purpose-heading"
      className="border-y border-stone-200 bg-[#eef5f8] px-4 py-10 sm:px-6 sm:py-14 xl:px-10"
    >
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-10">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
              What guides us
            </p>
            <h2
              id="about-purpose-heading"
              className="section-heading-accent mt-2 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
            >
              Our Vision &amp; Aims
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Through trekking, mountaineering and outdoor learning, we aim to help people grow
              while caring for the world they explore.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white sm:p-8">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-orange-200 uppercase">
              <Sprout aria-hidden="true" className="size-4" /> Our vision
            </p>
            <p className="mt-3 font-heading text-2xl font-medium leading-snug sm:text-3xl">
              To help young people develop a positive outlook, civic responsibility and respect for
              nature, carrying these values into everyday life.
            </p>
          </div>
        </div>

        <ol aria-label="Our seven aims" className="grid gap-4 md:grid-cols-2">
          {aims.map(({ title, description }, index) => (
            <li
              key={title}
              className={`rounded-2xl border border-stone-200 bg-[#fffefa] p-5 sm:p-6 ${index === aims.length - 1 ? "md:col-span-2" : ""}`}
            >
              <span aria-hidden="true" className="font-mono text-xs font-bold text-orange-800">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-base font-bold text-slate-900 sm:text-lg">{title}</h3>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ol>

        <ScrollReveal
          as="section"
          aria-labelledby="outdoor-learning-heading"
          className="grid gap-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
        >
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
              <GraduationCap aria-hidden="true" className="size-4" /> Learning beyond the classroom
            </p>
            <h3
              id="outdoor-learning-heading"
              className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Outdoor Learning Programmes for Schools
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
              We believe the outdoors can be a place for discovery, practical learning and personal
              growth. Our student programmes bring together adventure, environmental awareness,
              cooperation and a sense of responsibility.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
              Talk to our team about a detailed proposal tailored to your school’s learning
              objectives, students’ ages and experience, group needs and preferred dates.
            </p>
          </div>
          <Link
            href="/contact#enquiry-form"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-orange-700 px-4 py-3 text-sm font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
          >
            Plan a School Programme <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </ScrollReveal>
      </div>
    </ScrollReveal>
  );
}
