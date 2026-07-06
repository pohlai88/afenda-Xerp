// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface AccordionProps
  extends ComponentProps<typeof AccordionPrimitive.Root> {}
export interface AccordionItemProps
  extends ComponentProps<typeof AccordionPrimitive.Item> {}
export interface AccordionTriggerProps
  extends ComponentProps<typeof AccordionPrimitive.Trigger> {}
export interface AccordionContentProps
  extends ComponentProps<typeof AccordionPrimitive.Panel> {}

export function Accordion({ ...props }: AccordionProps) {
  return <AccordionPrimitive.Root {...props} data-slot="accordion" />;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={cn(
        "border-border border-b",
        typeof className === "string" ? className : undefined
      )}
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
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium text-sm transition-all hover:underline",
          typeof className === "string" ? className : undefined
        )}
        data-slot="accordion-trigger"
      >
        {children}
        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 data-[panel-open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Panel
      {...props}
      className={cn(
        "overflow-hidden text-sm",
        typeof className === "string" ? className : undefined
      )}
      data-slot="accordion-content"
    >
      <div className="pt-0 pb-4">{props.children}</div>
    </AccordionPrimitive.Panel>
  );
}
