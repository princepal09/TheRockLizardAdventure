"use client";

import { Dialog } from "@base-ui/react/dialog";
import { FileText, X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";

import { policies, type PolicyBlock, type PolicyId } from "@/lib/policies";

function PolicyBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === "list") {
      return (
        <ul key={index} className="list-disc space-y-2 pl-5 marker:text-orange-700">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );
    }
    if (block.type === "table") {
      return (
        <div key={index} className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Cancellation periods and applicable refunds</caption>
            <thead className="bg-orange-50 text-orange-950">
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col" className="px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (block.type === "subheading") {
      return (
        <h4 key={index} className="pt-2 font-semibold text-slate-900">
          {block.text}
        </h4>
      );
    }
    return <p key={index}>{block.text}</p>;
  });
}

export default function PolicyLink({
  policy,
  children,
  className,
}: {
  policy: PolicyId;
  children?: ReactNode;
  className?: string;
}) {
  const document = policies[policy];
  const jumpId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog.Root>
      <Dialog.Trigger type="button" className={`cursor-pointer text-left ${className ?? ""}`}>
        {children ?? document.title}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[90] bg-slate-950/75 backdrop-blur-sm" />
        <div className="pointer-events-none fixed inset-0 z-[100] grid place-items-center p-3 sm:p-6">
          <Dialog.Popup className="pointer-events-auto flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#fffefa] text-slate-900 shadow-2xl">
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 bg-[#0b1120] px-5 py-4 text-white sm:px-7">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-orange-300 uppercase">
                  <FileText aria-hidden="true" className="size-4 shrink-0" />
                  Rock Lizard Adventure
                </p>
                <Dialog.Title className="mt-2 font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                  {document.title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-xs text-slate-300">
                  Last updated: {document.lastUpdated}
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label={`Close ${document.title}`}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                <X aria-hidden="true" className="size-5" />
              </Dialog.Close>
            </header>
            <div className="shrink-0 border-b border-stone-200 bg-stone-50 px-5 py-3 sm:px-7">
              <label htmlFor={jumpId} className="sr-only">
                Jump to a section in {document.title}
              </label>
              <select
                id={jumpId}
                defaultValue=""
                onChange={(event) => {
                  const section = contentRef.current?.querySelector<HTMLElement>(
                    `[data-policy-section="${event.target.value}"]`,
                  );
                  section?.scrollIntoView({ block: "start" });
                  section?.focus({ preventScroll: true });
                }}
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-slate-800 focus-visible:outline-2 focus-visible:outline-orange-700"
              >
                <option value="" disabled>
                  Jump to a section
                </option>
                {document.sections.map(({ heading }, index) => (
                  <option key={heading} value={index}>
                    {heading}
                  </option>
                ))}
              </select>
            </div>
            <div
              ref={contentRef}
              role="region"
              aria-label={`${document.title} content`}
              tabIndex={0}
              className="min-h-0 space-y-7 overflow-y-auto overscroll-contain px-5 py-6 text-sm leading-7 break-words text-slate-700 outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-orange-700 sm:px-7 sm:py-7"
            >
              {document.intro.length > 0 && (
                <div className="space-y-4">
                  <PolicyBlocks blocks={document.intro} />
                </div>
              )}
              {document.sections.map(({ heading, blocks }, index) => (
                <section
                  key={heading}
                  data-policy-section={index}
                  tabIndex={-1}
                  className="scroll-mt-6 space-y-4 outline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-700"
                >
                  <h3 className="border-b border-stone-200 pb-2 text-base font-bold text-slate-900 sm:text-lg">
                    {heading}
                  </h3>
                  <PolicyBlocks blocks={blocks} />
                </section>
              ))}
            </div>
            <footer className="flex shrink-0 justify-end border-t border-stone-200 bg-stone-50 px-5 py-3 sm:px-7">
              <Dialog.Close className="min-h-11 rounded-lg bg-orange-700 px-5 text-sm font-semibold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
                Close policy
              </Dialog.Close>
            </footer>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
