"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

const NavLinks = ({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Treks", href: "/treks" },
    { name: "Expeditions", href: "/expeditions" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className={`flex text-sm font-medium text-gray-300 ${mobile ? "flex-col gap-1" : "items-center gap-5 2xl:gap-7"}`}
    >
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onNavigate={onNavigate}
            onClick={isActive ? onNavigate : undefined}
            className={`group relative whitespace-nowrap transition-colors hover:text-sky-400 focus:text-sky-400 ${mobile ? "rounded-md px-3 py-3 hover:bg-slate-800" : "px-1 py-2"}`}
          >
            {/* Link Text with glow effect when active or hovered */}
            <span
              className={`transition-all duration-200 ${
                isActive
                  ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  : "group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              }`}
            >
              {link.name}
            </span>

            {/* Framer Motion Animated Underline */}
            {isActive && !mobile && (
              <motion.span
                layoutId="activeIndicator"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 30 }
                }
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
