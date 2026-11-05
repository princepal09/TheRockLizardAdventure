"use client";

import { Accordion as Primitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion(props: Primitive.Root.Props) {
  return <Primitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem(props: Primitive.Item.Props) {
  return <Primitive.Item data-slot="accordion-item" {...props} />;
}

function AccordionTrigger({ className, children, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Header>
      <Primitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex w-full items-center justify-between gap-3 text-left",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-slate-500 motion-safe:transition-transform group-aria-expanded/trigger:rotate-180"
        />
      </Primitive.Trigger>
    </Primitive.Header>
  );
}

function AccordionContent(props: Primitive.Panel.Props) {
  return <Primitive.Panel data-slot="accordion-content" {...props} />;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
