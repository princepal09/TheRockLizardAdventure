import { Download } from "lucide-react";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import type { SiteSettings } from "@/types/site-settings";

// baseIconClass applies the permanent original colors, and hover:scale-110 adds the smooth zoom effect
const baseIconClass =
  "grid size-7 place-items-center rounded-full text-white transition-transform duration-300 hover:scale-110 hover:shadow-lg";

export default function SocialAndBrochureBar({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const socials = [
    {
      label: "Facebook",
      href: settings?.facebookUrl || "#",
      colorClass: "bg-[#1877F2]",
      Icon: FaFacebook,
    },
    {
      label: "YouTube",
      href: settings?.youtubeUrl || "#",
      colorClass: "bg-[#FF0000]",
      Icon: FaYoutube,
    },
    {
      label: "Instagram",
      href: settings?.instagramUrl || "#",
      colorClass: "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]",
      Icon: FaInstagram,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-800 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[10px] underline font-bold  tracking-wide text-slate-200 uppercase">
          Follow our ridgelines
        </h2>
        <div className="flex gap-3">
          {socials.map(({ label, href, colorClass, Icon }) => {
            const hasHref = href && href !== "#";

            const content = <Icon className="size-5" />;

            return hasHref ? (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} ${colorClass}`}
              >
                {content}
              </a>
            ) : (
              <span
                key={label}
                aria-hidden="true"
                className={`${baseIconClass} ${colorClass}`}
              >
                {content}
              </span>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[10px] font-semibold text-slate-200 disabled:cursor-not-allowed"
      >
        <Download aria-hidden="true" className="size-3 text-sky-400" />
        Download 2026 B2B Tariff &amp; Brochure
      </button>
    </div>
  );
}
