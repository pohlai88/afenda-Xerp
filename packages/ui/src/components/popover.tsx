"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import type { GovernedSurfaceProps, SlotRole } from "@/governance";
import { createGovernedDivSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const POPOVER_RECIPE_NAME = "surface" as const;

const POPOVER_SLOT_ROLES = {
  header: "header",
  title: "label",
  description: "state",
} as const satisfies Record<string, SlotRole>;

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export interface PopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    "className"
  >,
    GovernedSurfaceProps {
  readonly className?: string;
}

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      density = "standard",
      radius = "md",
      shadow = "overlay",
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Popover",
      recipeName: POPOVER_RECIPE_NAME,
      variant: { density, radius, shadow },
      slot: "root",
      className,
    });

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation({ ...props, align, sideOffset }, governed)}
        />
      </PopoverPrimitive.Portal>
    );
  }
);

PopoverContent.displayName = "PopoverContent";

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

const PopoverHeader = createGovernedDivSlot("PopoverHeader", {
  componentName: "Popover",
  recipeName: POPOVER_RECIPE_NAME,
  slot: POPOVER_SLOT_ROLES.header,
});

const PopoverTitle = createGovernedDivSlot("PopoverTitle", {
  componentName: "Popover",
  recipeName: POPOVER_RECIPE_NAME,
  slot: POPOVER_SLOT_ROLES.title,
});

interface PopoverDescriptionProps
  extends Omit<React.ComponentPropsWithoutRef<"p">, "className"> {
  readonly className?: string;
}

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  PopoverDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Popover",
    recipeName: POPOVER_RECIPE_NAME,
    slot: POPOVER_SLOT_ROLES.description,
    className,
  });

  return (
    <p ref={ref} {...applyGovernedPresentation(props, governed)} />
  );
});

PopoverDescription.displayName = "PopoverDescription";

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
