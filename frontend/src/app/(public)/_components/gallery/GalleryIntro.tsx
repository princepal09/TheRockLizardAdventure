import { Camera } from "lucide-react";

export default function GalleryIntro() {
  return (
    <div className="min-w-0 pb-3 sm:col-span-2 lg:col-span-1 lg:row-span-3 lg:pr-5">
      <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-sky-800 uppercase">
        <Camera aria-hidden="true" className="size-3.5" /> Rock Lizard Visual
        Archive
      </p>
      <h1
        id="gallery-heading"
        className="section-heading-accent mt-3 font-heading text-[clamp(3rem,5.25vw,5.5rem)] leading-[0.96] font-semibold tracking-tight"
      >
        Life on
        <br className="hidden lg:block" /> the{" "}
        <em className="text-orange-700">Trail.</em>
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 sm:text-base">
        A field gallery from Rock Lizard Adventure. Explore the terrain, camps,
        and moments along our treks and expeditions in Uttarakhand.
      </p>
    </div>
  );
}
