"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import type { GovernedFormControlProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const SCROLL_AREA_RECIPE_NAME = "form-control" as const;

export interface ScrollAreaProps
  extends Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Root>, "className">,
    GovernedFormControlProps {
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
    slot: "root",
    className,
  });

  const viewportGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    slot: "body",
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

export interface ScrollBarProps
  extends Omit<
    React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    "className"
  > {
  readonly className?: string;
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  const scrollbarGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    slot: "control",
    className,
  });

  const thumbGoverned = resolvePrimitiveGovernance({
    componentName: "ScrollArea",
    recipeName: SCROLL_AREA_RECIPE_NAME,
    slot: "icon",
  });

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      {...applyGovernedPresentation(props, scrollbarGoverned, {
        "data-orientation": orientation,
      })}
      orientation={orientation}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        {...applyGovernedPresentation({}, thumbGoverned)}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
