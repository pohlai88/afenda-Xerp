"use client";

import type { GovernedScrollAreaProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import * as React from "react";

const SCROLL_AREA_RECIPE_NAME = "form-control" as const;

const SCROLL_AREA_SLOT_ROLES = {
  root: "root",
  body: "body",
  control: "control",
  icon: "icon",
} as const satisfies Record<string, SlotRole>;

export interface ScrollAreaProps
  extends Omit<
      React.ComponentProps<typeof ScrollAreaPrimitive.Root>,
      "className"
    >,
    GovernedScrollAreaProps {
  readonly className?: string;
}

export interface ScrollBarProps
  extends Omit<
    React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    "className"
  > {
  readonly className?: string;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, state, children, ...props }, ref) => {
  const rootGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    state,
    slot: SCROLL_AREA_SLOT_ROLES.root,
    className,
  });

  const viewportGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    slot: SCROLL_AREA_SLOT_ROLES.body,
  });

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, rootGoverned)}
    >
      <ScrollAreaPrimitive.Viewport
        {...applyGovernedPresentation({}, viewportGoverned)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});

ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  const scrollbarGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    slot: SCROLL_AREA_SLOT_ROLES.control,
    className,
  });

  const thumbGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    slot: SCROLL_AREA_SLOT_ROLES.icon,
  });

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      {...applyGovernedPresentation(props, scrollbarGoverned, {
        "data-orientation": orientation,
      })}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        {...applyGovernedPresentation({}, thumbGoverned)}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
