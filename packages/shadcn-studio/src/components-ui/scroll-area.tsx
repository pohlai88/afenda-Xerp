"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  SCROLL_AREA_SLOTS,
  scrollAreaRootClassName,
  scrollAreaScrollbarClassName,
  scrollAreaThumbClassName,
  scrollAreaViewportClassName,
} from "./scroll-area.contract.js";

type ScrollAreaProps = WithoutGovernedDataSlot<ScrollAreaPrimitive.Root.Props>;
type ScrollBarProps =
  WithoutGovernedDataSlot<ScrollAreaPrimitive.Scrollbar.Props>;

function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={cn(scrollAreaRootClassName, className)}
      data-slot={SCROLL_AREA_SLOTS.root}
    >
      <ScrollAreaPrimitive.Viewport
        className={scrollAreaViewportClassName}
        data-slot={SCROLL_AREA_SLOTS.viewport}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner data-slot={SCROLL_AREA_SLOTS.corner} />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      {...props}
      className={cn(scrollAreaScrollbarClassName, className)}
      data-orientation={orientation}
      data-slot={SCROLL_AREA_SLOTS.scrollbar}
      orientation={orientation}
    >
      <ScrollAreaPrimitive.Thumb
        className={scrollAreaThumbClassName}
        data-slot={SCROLL_AREA_SLOTS.thumb}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export type { ScrollAreaSlot } from "./scroll-area.contract.js";
export type { ScrollAreaProps, ScrollBarProps };
export { ScrollArea, ScrollBar };
