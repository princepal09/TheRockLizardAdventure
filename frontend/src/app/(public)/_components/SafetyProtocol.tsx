"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowLeft,
  Backpack,
  ClipboardCheck,
  CloudSun,
  Download,
  HeartPulse,
  Phone,
  Route,
  ShieldCheck,
  UsersRound,
  Utensils,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { declarationForm } from "@/lib/declaration-form";
import { medicalForm } from "@/lib/medical-form";
import { basecampPhone } from "@/types/basecamp";

const protocols = [
  {
    Icon: ClipboardCheck,
    title: "Prepare before departure",
    description:
      "Discuss your experience, fitness and trip expectations with Basecamp. Confirm the required documents and arrange the medical certificate with your doctor.",
  },
  {
    Icon: Route,
    title: "Understand your route",
    description:
      "Review the itinerary, daily walking time, altitude and acclimatization schedule. Ask the team how the planned pace fits your group before confirming your departure.",
  },
  {
    Icon: Backpack,
    title: "Check your equipment",
    description:
      "Get the gear list for your route and season. Confirm rental availability, sizes and collection arrangements with the Almora team in advance.",
  },
  {
    Icon: CloudSun,
    title: "Plan for changing conditions",
    description:
      "Ask about weather, trail conditions and possible itinerary changes. Confirm how the team communicates updates and makes route decisions during the trip.",
  },
  {
    Icon: UsersRound,
    title: "Know your mountain team",
    description:
      "Confirm the group size, guide arrangements and on-trail check-ins. Discuss any support you may need, including arrangements for children or private groups.",
  },
  {
    Icon: HeartPulse,
    title: "Make an emergency plan",
    description:
      "Ask your expedition lead about route-specific medical equipment, communications and emergency descent arrangements. Share your emergency contact and tell your guide promptly if you feel unwell.",
  },
];

const documents = [
  {
    title: "Medical Fitness Certificate",
    description: "For completion by an MBBS/MD/MS doctor.",
    document: medicalForm,
  },
  {
    title: "Declaration / Indemnity Bond",
    description: "Read the document and complete the participant details.",
    document: declarationForm,
  },
];

export default function SafetyProtocol({ phone = basecampPhone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        tabIndex={0}
        aria-label="Open TRLA Safety Protocol"
        render={
          <motion.button
            initial={false}
            whileHover={reduceMotion ? undefined : { x: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        }
        className="fixed top-1/2 right-0 z-40 inline-flex min-w-8 -translate-y-1/2 items-center gap-1 rounded-l-lg border border-r-0 border-orange-400 bg-orange-600 px-1.5 py-2 font-mono text-[8px] font-bold tracking-wide text-white uppercase shadow-lg hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-900 [writing-mode:vertical-rl] sm:min-w-9 sm:gap-1.5 sm:px-2 sm:py-2.5 sm:text-[9px] sm:tracking-wider"
      >
        <ShieldCheck aria-hidden="true" className="size-3 sm:size-3.5" />
        TRLA Safety Protocol
        <motion.span
          aria-hidden="true"
          className="grid size-4 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 sm:size-5"
          initial={false}
          animate={{ x: reduceMotion || open ? 0 : [0, -3, 0] }}
          transition={{
            duration: 1,
            repeat: reduceMotion || open ? 0 : Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        >
          <ArrowLeft className="size-2.5 sm:size-3" />
        </motion.span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm"
          render={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          }
        />
        <div className="pointer-events-none fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6">
          <Dialog.Popup
            className="pointer-events-auto flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#f5f3ee] text-slate-900 shadow-2xl sm:rounded-3xl"
            render={
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.25,
                  ease: "easeOut",
                }}
              />
            }
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0b1120] px-5 py-4 text-white sm:px-7">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-orange-400/30 bg-orange-500/10 text-orange-300">
                  <ShieldCheck aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-orange-300 uppercase">
                    Almora Basecamp · Field notes
                  </p>
                  <Dialog.Title className="mt-1 text-base font-bold tracking-tight sm:text-lg">
                    TRLA Safety Protocol
                  </Dialog.Title>
                </div>
              </div>
              <Dialog.Close
                aria-label="Close safety protocol"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                <X aria-hidden="true" className="size-5" />
              </Dialog.Close>
            </div>

            <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7 sm:py-7">
              <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
                The mountain starts with preparation
              </p>
              <h2 className="section-heading-accent mt-2 font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Prepared before the first step.
              </h2>
              <Dialog.Description className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                A practical planning guide for your Rock Lizard Adventure departure. Work through
                these points with the Almora team and confirm the arrangements for your specific
                route.
              </Dialog.Description>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {protocols.map(({ Icon, title, description }, index) => (
                  <article
                    key={title}
                    className="rounded-2xl border border-stone-200 bg-[#fffefa] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-800">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span aria-hidden="true" className="font-mono text-xs text-stone-400">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <Utensils aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-800" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Food, water & personal requirements
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Confirm camp meals and drinking-water arrangements. Share allergies, dietary
                    requirements and relevant health information before booking so the team can
                    discuss what it can accommodate.
                  </p>
                </div>
              </div>

              <section aria-labelledby="safety-documents-title" className="mt-6">
                <h3 id="safety-documents-title" className="text-sm font-bold">
                  Your departure documents
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Download the original forms and confirm submission requirements with Basecamp.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {documents.map(({ title, description, document }) => (
                    <a
                      key={title}
                      href={document.href}
                      download={document.downloadName}
                      className="flex items-start justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
                    >
                      <div>
                        <p className="text-xs font-bold text-orange-950">{title}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-orange-900/80">
                          {description}
                        </p>
                        <span className="mt-2 inline-block font-mono text-[9px] font-bold tracking-wider text-orange-800 uppercase">
                          Download PDF
                        </span>
                      </div>
                      <Download aria-hidden="true" className="size-4 shrink-0 text-orange-800" />
                    </a>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-stone-200 bg-[#fffefa] px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold">Questions about your route?</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Confirm the details directly with Basecamp.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold hover:bg-stone-100"
                >
                  <Phone aria-hidden="true" className="size-3.5" /> Call Basecamp
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center rounded-lg bg-secondary px-4 text-xs font-bold text-white hover:bg-orange-800"
                >
                  Plan with our team
                </Link>
              </div>
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
