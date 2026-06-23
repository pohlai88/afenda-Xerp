"use client";

import type { GovernedAccordionProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import * as React from "react";

const ACCORDION_RECIPE_NAME = "surface" as const;

type AccordionRootProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
>;

export type AccordionProps = AccordionRootProps &
  GovernedAccordionProps & {
    readonly className?: string;
  };

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    state,
    slot: "root",
    className,
  });

  // Radix Accordion.Root is a discriminated union (single | multiple).
  // TypeScript cannot narrow a union spread with exactOptionalPropertyTypes,
  // so we cast through the known union type to preserve semantic types.
  return (
    <AccordionPrimitive.Root
      ref={ref}
      {...(applyGovernedPresentation(
        props,
        governed
      ) as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>)}
    />
  );
});

Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    "className"
  > {
  readonly className?: string;
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slot: "label",
    className,
  });

  return (
    <AccordionPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const header = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slotKey: "header",
  });

  const governed = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slot: "control",
    className,
  });

  const iconDown = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slotKey: "trigger-icon-down",
  });

  const iconUp = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slotKey: "trigger-icon-up",
  });

  return (
    <AccordionPrimitive.Header {...applyGovernedPresentation({}, header)}>
      <AccordionPrimitive.Trigger
        ref={ref}
        {...applyGovernedPresentation(props, governed)}
      >
        {children}
        <ChevronDownIcon
          aria-hidden="true"
          {...applyGovernedPresentation({}, iconDown)}
        />
        <ChevronUpIcon
          aria-hidden="true"
          {...applyGovernedPresentation({}, iconUp)}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    "className"
  > {
  readonly className?: string;
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slot: "content",
  });

  const inner = resolvePrimitiveGovernance({
    componentName: "Accordion",
    recipeName: ACCORDION_RECIPE_NAME,
    slotKey: "content-inner",
    className,
  });

  return (
    <AccordionPrimitive.Content
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <div {...applyGovernedPresentation({}, inner)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
