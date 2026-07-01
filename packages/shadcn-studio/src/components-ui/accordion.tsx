import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { composeClassName } from "@/lib/compose-class-name";
import type { GovernedPrimitiveProps } from "@/lib/governed-primitive-props";

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

type AccordionProps = GovernedPrimitiveProps<AccordionPrimitive.Root.Props>;
type AccordionItemProps = GovernedPrimitiveProps<AccordionPrimitive.Item.Props>;
type AccordionTriggerProps =
  GovernedPrimitiveProps<AccordionPrimitive.Trigger.Props>;
type AccordionContentProps =
  GovernedPrimitiveProps<AccordionPrimitive.Panel.Props> & {
    innerClassName?: string;
  };

function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      {...props}
      className={composeClassName(accordionRootClassName, className)}
      data-slot={ACCORDION_SLOTS.root}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={composeClassName(accordionItemClassName, className)}
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
        className={composeClassName(accordionTriggerClassName, className)}
        data-slot={ACCORDION_SLOTS.trigger}
      >
        {children}
        <ChevronDownIcon
          className={`${accordionTriggerIconClassName} group-data-[panel-open]/accordion-trigger:hidden`}
          data-slot={ACCORDION_SLOTS.triggerIcon}
        />
        <ChevronUpIcon
          className={`${accordionTriggerIconClassName} hidden group-data-[panel-open]/accordion-trigger:inline`}
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
      className={composeClassName(accordionContentPanelClassName, className)}
      data-slot={ACCORDION_SLOTS.content}
    >
      <div
        className={composeClassName(
          accordionContentInnerClassName,
          innerClassName
        )}
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
