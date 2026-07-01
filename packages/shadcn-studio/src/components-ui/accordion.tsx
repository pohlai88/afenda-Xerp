import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  ACCORDION_SLOTS,
  accordionContentInnerClassName,
  accordionContentPanelClassName,
  accordionHeaderClassName,
  accordionItemClassName,
  accordionRootClassName,
  accordionTriggerClassName,
  accordionTriggerIconClassName,
} from "./accordion.contract.js";

type AccordionProps = WithoutGovernedDataSlot<AccordionPrimitive.Root.Props>;
type AccordionItemProps =
  WithoutGovernedDataSlot<AccordionPrimitive.Item.Props>;
type AccordionTriggerProps =
  WithoutGovernedDataSlot<AccordionPrimitive.Trigger.Props>;
type AccordionContentProps =
  WithoutGovernedDataSlot<AccordionPrimitive.Panel.Props> & {
    innerClassName?: string;
  };

function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      {...props}
      className={cn(accordionRootClassName, className)}
      data-slot={ACCORDION_SLOTS.root}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={cn(accordionItemClassName, className)}
      data-slot={ACCORDION_SLOTS.item}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header
      className={accordionHeaderClassName}
      data-slot={ACCORDION_SLOTS.header}
    >
      <AccordionPrimitive.Trigger
        {...props}
        className={cn(accordionTriggerClassName, className)}
        data-slot={ACCORDION_SLOTS.trigger}
      >
        {children}
        <ChevronDownIcon
          className={`${accordionTriggerIconClassName} group-aria-expanded/accordion-trigger:hidden`}
          data-slot={ACCORDION_SLOTS.triggerIcon}
        />
        <ChevronUpIcon
          className={`${accordionTriggerIconClassName} hidden group-aria-expanded/accordion-trigger:inline`}
          data-slot={ACCORDION_SLOTS.triggerIcon}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  innerClassName,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Panel
      {...props}
      className={cn(accordionContentPanelClassName, className)}
      data-slot={ACCORDION_SLOTS.content}
    >
      <div
        className={cn(accordionContentInnerClassName, innerClassName)}
        data-slot={ACCORDION_SLOTS.contentInner}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export type { AccordionSlot } from "./accordion.contract.js";
export type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
};
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
