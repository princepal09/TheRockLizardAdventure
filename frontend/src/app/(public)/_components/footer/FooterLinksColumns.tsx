import Link from "next/link";
import { privacyPolicy } from "@/lib/privacy-policy";
import { medicalForm } from "@/lib/medical-form";
import { declarationForm } from "@/lib/declaration-form";

type FooterItem = { label: string; href?: string; download?: string };

const columns: { title: string; items: FooterItem[] }[] = [
  {
    title: "Expeditions & Base",
    items: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Treks", href: "/treks" },
      { label: "Expeditions", href: "/expeditions" },
      { label: "Trail Gallery", href: "/gallery" },
      { label: "Rent A Gear Almora" },
      { label: "Travel Trade", href: "/travel-trade" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Governance & Safety",
    items: [
      { label: "Disclaimer" },
      { label: "Privacy Policy", href: privacyPolicy.href, download: privacyPolicy.downloadName },
      { label: "Terms & Condition" },
      { label: "Trek Insurance & Safety" },
      { label: "Medical Form", href: medicalForm.href, download: medicalForm.downloadName },
      { label: "Declaration Form (Indemnity Bond)", href: declarationForm.href, download: declarationForm.downloadName },
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
            {items.map(({ label, href, download }) => (
              <li key={label}>
                {href && download ? (
                  <a
                    href={href}
                    download={download}
                    className="hover:text-white hover:underline focus-visible:underline"
                  >
                    {label}
                    <span className="sr-only"> (download PDF)</span>
                  </a>
                ) : href ? (
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
