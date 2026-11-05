import BasecampStory from "./BasecampStory";
import SectionReveal from "./SectionReveal";
import SummitStats from "./SummitStats";

export default function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="mountaineering-standard"
      className="bg-[#101727] bg-[radial-gradient(ellipse_at_bottom_left,#f9731614,transparent_38%),radial-gradient(ellipse_at_top_right,#0ea5e910,transparent_45%)] px-4 py-10 text-white sm:px-6 sm:py-12 xl:px-10"
    >
      <SectionReveal>
        <p className="font-mono text-[10px] font-bold tracking-widest text-sky-400 uppercase">
          Based in Almora · Exploring India
        </p>
        <h2
          id="mountaineering-standard"
          className="section-heading-accent mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          The Almora Mountaineering Standard
        </h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-300">
          From our Almora Basecamp, we help you prepare for adventures across Uttarakhand, Kashmir
          and Maharashtra.
        </p>
      </SectionReveal>
      <div className="mt-7 grid gap-4 md:grid-cols-[1.4fr_1fr] lg:gap-6">
        <SectionReveal className="h-full" delay={0.06}>
          <BasecampStory />
        </SectionReveal>
        <SummitStats />
      </div>
    </section>
  );
}
