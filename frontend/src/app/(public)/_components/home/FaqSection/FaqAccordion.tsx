"use client";

import { Backpack, Compass, Repeat2, Ticket, UsersRound } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { faqCategories } from "@/types/faq-data";

const icons = [Compass, Ticket, UsersRound, Backpack, Repeat2];

export default function FaqAccordion() {
  const [active, setActive] = useState(0);
  const { items } = faqCategories[active];

  return (
    <>
      <div
        role="group"
        aria-label="FAQ categories"
        className="my-6 flex flex-wrap justify-center gap-2"
      >
        {faqCategories.map(({ label }, index) => {
          const Icon = icons[index];
          return (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className="h-auto rounded-xl border-slate-200 bg-white px-3 py-1.5 text-xs whitespace-normal aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-[#ffffff]"
            >
              <Icon aria-hidden="true" /> {label}
            </Button>
          );
        })}
      </div>
      <Accordion
        key={active}
        defaultValue={[items[0].question]}
        className="space-y-2.5"
      >
        {items.map(({ question, answer }) => (
          <AccordionItem
            key={question}
            value={question}
            className="rounded-xl border border-stone-200 bg-[#fffefa] shadow-sm"
          >
            <AccordionTrigger className="cursor-pointer rounded-xl px-4 py-3.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-sky-700">
              {question}
            </AccordionTrigger>
            <AccordionContent className="border-t border-stone-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
              <p>{answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
