"use client";

import { Headset, Mountain, Phone, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { basecampPhone } from "@/types/basecamp";

export default function WhatsAppWidget({
  phone = basecampPhone,
  callPhone = basecampPhone,
}: {
  phone?: string;
  callPhone?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstAction = useRef<HTMLAnchorElement>(null);
  const menuId = useId();
  const phoneNumber = phone.replace(/\D/g, "");
  const telephone = callPhone.replace(/[^+\d]/g, "");
  const message = encodeURIComponent("Hello! I want to know more about your treks and packages.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  function closeMenu() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      firstAction.current?.focus({ preventScroll: true });
    });
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const itemVariants = {
    closed: { opacity: 0, x: 12, scale: 0.98, transition: { duration: reducedMotion ? 0 : 0.1 } },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: reducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  const actionClass =
    "flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:scale-[1.03] motion-safe:focus-visible:scale-[1.03]";

  return (
    <>
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close contact options"
          onClick={closeMenu}
          className="fixed inset-0 z-50 cursor-default bg-slate-950/10"
        />
      )}
      <div
        className="fixed right-6 bottom-6 z-[60]"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <motion.nav
          id={menuId}
          aria-label="Contact Basecamp"
          aria-hidden={!open}
          inert={!open}
          initial={false}
          animate={open ? "open" : "closed"}
          variants={{
            open: {
              opacity: 1,
              transition: { duration: 0, staggerChildren: 0 },
            },
            closed: { opacity: 0, transition: { duration: reducedMotion ? 0 : 0.1 } },
          }}
          style={{ pointerEvents: open ? "auto" : "none" }}
          className="absolute  right-0 bottom-20 flex w-[min(18rem,calc(100vw-3rem))] flex-col gap-3"
        >
          <motion.div variants={itemVariants}>
            <Link
              ref={firstAction}
              href="/contact?topic=custom-trip#enquiry-form"
              onClick={closeMenu}
              className={`${actionClass} bg-amber-400 text-slate-950 hover:bg-amber-300`}
            >
              <Mountain aria-hidden="true" className="size-5 shrink-0" />
              Plan Your Adventure
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className={`${actionClass} bg-[#25D366] text-slate-950 hover:bg-[#20c35e]`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.84 9.84 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp Us
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </motion.div>
          <motion.div variants={itemVariants}>
            <a
              href={`tel:${telephone}`}
              onClick={closeMenu}
              className={`${actionClass} bg-violet-700 text-white hover:bg-violet-800`}
            >
              <Phone aria-hidden="true" className="size-5 shrink-0" />
              Call Basecamp
            </a>
          </motion.div>
        </motion.nav>
        {!open &&
          [0, 1].map((ring) => (
            <motion.span
              key={ring}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-violet-400/60 bg-violet-600/30"
              initial={{ scale: 1, opacity: 0 }}
              animate={
                reducedMotion === false
                  ? { scale: [1, 1.75], opacity: [0.6, 0] }
                  : { scale: 1, opacity: 0 }
              }
              transition={
                reducedMotion === false
                  ? {
                      duration: 1.8,
                      delay: ring * 0.9,
                      repeat: Infinity,
                      ease: "easeOut",
                    }
                  : { duration: 0 }
              }
            />
          ))}
        <motion.button
          ref={trigger}
          type="button"
          aria-label={open ? "Close contact options" : "Open contact options"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          initial={false}
          whileHover={reducedMotion ? undefined : { scale: 1.06 }}
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          className={`relative grid size-16 cursor-pointer place-items-center rounded-full text-white shadow-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-800 ${open ? "bg-red-600 hover:bg-red-700" : "bg-violet-700 hover:bg-violet-800"}`}
        >
          {open ? (
            <X aria-hidden="true" className="size-8" />
          ) : (
            <Headset aria-hidden="true" className="size-8" />
          )}
        </motion.button>
      </div>
    </>
  );
}
