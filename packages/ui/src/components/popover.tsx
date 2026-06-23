"use client";

import type {
  GovernedPopoverProps,
  GovernedSurfaceProps,
  SlotRole,
} from "@afenda/ui/governance";
import { createGovernedDivSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Popover as PopoverPrimitive } from "radix-ui";
import * as React from "react";

const POPOVER_RECIPE_NAME = "surface" as const;

const POPOVER_SLOT_ROLES = {
  header: "header",
  title: "label",
  description: "state",
} as const satisfies Record<string, SlotRole>;

export interface PopoverProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>,
      "className"
    >,
    GovernedPopoverProps {
  readonly className?: string;
}

function Popover({ className, state, ...props }: PopoverProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Popover",
    recipeName: POPOVER_RECIPE_NAME,
    slotKey: "menu-root",
    state,
    className,
  });

  return (
    <PopoverPrimitive.Root {...applyGovernedPresentation(props, governed)} />
  );
}

Popover.displayName = "Popover";

export interface PopoverTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
}

const PopoverTrigger = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Popover",
    recipeName: POPOVER_RECIPE_NAME,
    slotKey: "trigger",
    className,
  });

  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

PopoverTrigger.displayName = "PopoverTrigger";

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
          {...applyGovernedPresentation(
            { ...props, align, sideOffset },
            governed
          )}
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

PopoverAnchor.displayName = "PopoverAnchor";

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

export interface PopoverDescriptionProps
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

  return <p ref={ref} {...applyGovernedPresentation(props, governed)} />;
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
