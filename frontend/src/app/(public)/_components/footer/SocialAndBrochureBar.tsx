import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import type { SiteSettings } from "@/types/site-settings";
import { normalizeSocialUrl } from "@/lib/social-url";

// baseIconClass applies the permanent original colors, and hover:scale-110 adds the smooth zoom effect
const baseIconClass =
  "grid size-7 place-items-center rounded-full text-white transition-transform duration-300 hover:scale-110 hover:shadow-lg";

export default function SocialAndBrochureBar({ settings }: { settings: SiteSettings | null }) {
  const socials = [
    {
      label: "Facebook",
      href: normalizeSocialUrl(settings?.facebookUrl),
      colorClass: "bg-[#1877F2]",
      Icon: FaFacebook,
    },
    {
      label: "YouTube",
      href: normalizeSocialUrl(settings?.youtubeUrl),
      colorClass: "bg-[#FF0000]",
      Icon: FaYoutube,
    },
    {
      label: "Instagram",
      href: normalizeSocialUrl(settings?.instagramUrl),
      colorClass: "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]",
      Icon: FaInstagram,
    },
  ].filter((social) => social.href);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-800 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[10px] underline font-bold  tracking-wide text-slate-200 uppercase">
          {socials.length ? "Follow our ridgelines" : "Stay connected with Basecamp"}
        </h2>
        <div className="flex gap-3">
          {socials.map(({ label, href, colorClass, Icon }) => {
            const content = <Icon className="size-5" />;

            return (
              <a
                key={label}
                href={href!}
                aria-label={`${label} (opens in a new tab)`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} ${colorClass}`}
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>

      <Link
        href="/contact?topic=collaboration#enquiry-form"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[10px] font-semibold text-slate-200 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        <ArrowUpRight aria-hidden="true" className="size-3 text-sky-400" />
        Company &amp; NGO Collaborations
      </Link>
    </div>
  );
}
