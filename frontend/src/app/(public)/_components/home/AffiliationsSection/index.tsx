import Image from "next/image";

const affiliations = [
  {
    name: "Uttarakhand Tourism",
    image: "/affiliation/uttarakhand_tourims.jpg",
    width: 216,
    height: 75,
  },
  {
    name: "Indian Mountaineering Foundation",
    image: "/affiliation/indian_moutanieering_foundation.png",
    width: 321,
    height: 123,
  },
];

export default function AffiliationsSection() {
  return (
    <section
      aria-labelledby="affiliations-heading"
      className="border-b border-slate-200 bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 sm:py-6 xl:px-10"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-4 lg:flex-row lg:justify-between lg:gap-8">
        <div className="shrink-0 text-center lg:text-left">
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
            Connected to the outdoors
          </p>
          <h2
            id="affiliations-heading"
            className="mt-1 font-heading text-2xl font-semibold tracking-tight"
          >
            Our Affiliations
          </h2>
        </div>
        <ul className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-5">
          {affiliations.map(({ name, image, width, height }) => (
            <li
              key={name}
              className="flex min-h-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-4 sm:px-6"
            >
              <Image
                src={image}
                alt={name}
                width={width}
                height={height}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 45vw"
                className="h-14 w-full object-contain sm:h-16"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
