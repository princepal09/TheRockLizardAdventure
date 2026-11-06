import ScrollReveal from "../../ScrollReveal";
import DispatchFeed from "./DispatchFeed";

export default function DispatchesSection() {
  return (
    <section
      aria-labelledby="dispatches-heading"
      className="border-y border-stone-200 bg-[#f5f3ee] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10"
    >
      <ScrollReveal>
        <DispatchFeed />
      </ScrollReveal>
    </section>
  );
}
