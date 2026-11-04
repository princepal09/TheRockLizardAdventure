import Link from "next/link";

const columns = [
  {
    title: "Expeditions & Base",
    items: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Treks", href: "/treks" },
      { label: "Expeditions", href: "/expeditions" },
      { label: "Rent A Gear Almora" },
      { label: "B2B Partner Showcase" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Governance & Safety",
    items: [
      { label: "Disclaimer" },
      { label: "Website Privacy" },
      { label: "Terms & Condition" },
      { label: "Trek Insurance & Safety" },
      { label: "Responsible Tourism Policy" },
    ],
  },
];

export default function FooterLinksColumns() {
  return (
    <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-4">
      {columns.map(({ title, items }) => (
        <section key={title}>
          <h2 className="mb-2 text-[10px] font-bold tracking-wide text-slate-200 uppercase">
            {title}
          </h2>
          <ul className="space-y-1.5 text-[11px] leading-snug text-slate-400">
            {items.map(({ label, href }) => (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    className="hover:text-white hover:underline focus-visible:underline"
                  >
                    {label}
                  </Link>
                ) : (
                  label
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
