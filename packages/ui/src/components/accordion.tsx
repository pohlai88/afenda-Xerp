"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "#/lib/utils";
import type { GovernedAccordionProps } from "@/governance";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const ACCORDION_RECIPE_NAME = "surface" as const;

interface AccordionSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

export interface AccordionProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
      "className"
    >,
    GovernedAccordionProps {
  readonly className?: string;
}

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
  const radixProps = props as React.ComponentPropsWithoutRef<
    typeof AccordionPrimitive.Root
  >;

  const rootProps = {
    ...radixProps,
    ...governed.dataAttributes,
    className: cn(governed.className),
  } as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

  return <AccordionPrimitive.Root ref={ref} {...rootProps} />;
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
      {...props}
      {...governed.dataAttributes}
      className={cn(governed.className)}
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
    <AccordionPrimitive.Header
      {...header.dataAttributes}
      className={cn(header.className)}
    >
      <AccordionPrimitive.Trigger
        ref={ref}
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      >
        {children}
        <ChevronDownIcon
          {...iconDown.dataAttributes}
          className={cn(iconDown.className)}
        />
        <ChevronUpIcon
          {...iconUp.dataAttributes}
          className={cn(iconUp.className)}
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
      {...props}
      {...governed.dataAttributes}
      className={cn(governed.className)}
    >
      <div {...inner.dataAttributes} className={cn(inner.className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
