"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface AccordionProps
  extends ComponentProps<typeof AccordionPrimitive.Root> {}
export interface AccordionItemProps
  extends Omit<ComponentProps<typeof AccordionPrimitive.Item>, "className"> {
  readonly className?: string | undefined;
}
export interface AccordionTriggerProps
  extends Omit<ComponentProps<typeof AccordionPrimitive.Trigger>, "className"> {
  readonly className?: string | undefined;
}
export interface AccordionContentProps
  extends Omit<ComponentProps<typeof AccordionPrimitive.Panel>, "className"> {
  readonly className?: string | undefined;
}

const ACCORDION_ITEM_CLASS = "border-border border-b";
const ACCORDION_TRIGGER_CLASS =
  "group flex flex-1 items-center justify-between py-4 font-medium text-sm transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
const ACCORDION_CONTENT_CLASS = "overflow-hidden text-sm";

export function accordionItemClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(ACCORDION_ITEM_CLASS, className);
}

export function accordionTriggerClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(ACCORDION_TRIGGER_CLASS, className);
}

export function accordionContentClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(ACCORDION_CONTENT_CLASS, className);
}

export function Accordion({ ...props }: AccordionProps) {
  return <AccordionPrimitive.Root {...props} data-slot="accordion" />;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={accordionItemClassName({ className })}
      data-slot="accordion-item"
    />
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        {...props}
        className={accordionTriggerClassName({ className })}
        data-slot="accordion-trigger"
      >
        {children}
        <span className="inline-flex shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180">
          <ChevronDownIcon aria-hidden="true" className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Panel
      {...props}
      className={accordionContentClassName({ className })}
      data-slot="accordion-content"
    >
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Panel>
  );
}
