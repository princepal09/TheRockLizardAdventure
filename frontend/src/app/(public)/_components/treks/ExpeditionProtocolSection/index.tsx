import { Backpack, BriefcaseMedical, UsersRound, Utensils } from "lucide-react";

const protocols = [
  {
    Icon: BriefcaseMedical,
    title: "Medical & Safety Planning",
    description:
      "Ask your expedition lead about route-specific medical equipment, check-ins, and emergency descent arrangements before departure.",
  },
  {
    Icon: UsersRound,
    title: "Local Guides & Small Groups",
    description:
      "Plan your departure with the Almora team and confirm the group size and guide arrangements for your route.",
  },
  {
    Icon: Utensils,
    title: "Fresh Pahadi Nutrition",
    description:
      "Ask about meals featuring Pahadi staples such as mandua and gahat. Share any dietary needs when you book.",
  },
  {
    Icon: Backpack,
    title: "Almora Rental Depot",
    description:
      "Check availability and sizing for sleeping bags, trekking poles, and other route-specific gear with Basecamp.",
  },
];

export default function ExpeditionProtocolSection() {
  return (
    <section
      aria-labelledby="expedition-protocol-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-7"
    >
      <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
        The Standard of Care
      </p>
      <h2
        id="expedition-protocol-heading"
        className="section-heading-accent mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        The Rock Lizard Expedition Protocol
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Plan for the trail with the Almora team, from guide arrangements and
        camp meals to gear and route-specific safety preparations.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {protocols.map(({ Icon, title, description }) => (
          <div key={title}>
            <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-orange-700">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <h3 className="mt-2 text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
