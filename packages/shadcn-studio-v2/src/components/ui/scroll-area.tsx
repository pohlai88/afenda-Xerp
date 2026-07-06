"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ScrollAreaProps
  extends Omit<ComponentProps<typeof ScrollAreaPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}
export interface ScrollAreaViewportProps
  extends Omit<
    ComponentProps<typeof ScrollAreaPrimitive.Viewport>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface ScrollBarProps
  extends Omit<
    ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface ScrollThumbProps
  extends Omit<ComponentProps<typeof ScrollAreaPrimitive.Thumb>, "className"> {
  readonly className?: string | undefined;
}
export interface ScrollCornerProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Corner> {}

const SCROLL_AREA_BASE_CLASS = "relative overflow-hidden";
const SCROLL_AREA_VIEWPORT_CLASS = "size-full rounded-[inherit]";
const SCROLL_AREA_THUMB_CLASS = "relative flex-1 rounded-full bg-border";

export function scrollAreaClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(SCROLL_AREA_BASE_CLASS, className);
}

export function scrollAreaViewportClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(SCROLL_AREA_VIEWPORT_CLASS, className);
}

export function scrollBarClassName({
  className,
  orientation,
}: {
  readonly className?: string | undefined;
  readonly orientation?: ScrollBarProps["orientation"];
} = {}): string {
  return cn(
    "flex touch-none select-none p-0.5 transition-colors",
    orientation === "horizontal"
      ? "h-2.5 flex-col border-t border-t-transparent"
      : "w-2.5 border-l border-l-transparent",
    className
  );
}

export function scrollThumbClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(SCROLL_AREA_THUMB_CLASS, className);
}

export function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={scrollAreaClassName({ className })}
      data-slot="scroll-area"
    />
  );
}

export function ScrollAreaViewport({
  className,
  ...props
}: ScrollAreaViewportProps) {
  return (
    <ScrollAreaPrimitive.Viewport
      {...props}
      className={scrollAreaViewportClassName({ className })}
      data-slot="scroll-area-viewport"
    />
  );
}

export function ScrollBar({
  className,
  orientation,
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      {...props}
      className={scrollBarClassName({ className, orientation })}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
    />
  );
}

export function ScrollThumb({ className, ...props }: ScrollThumbProps) {
  return (
    <ScrollAreaPrimitive.Thumb
      {...props}
      className={scrollThumbClassName({ className })}
      data-slot="scroll-area-thumb"
    />
  );
}

export function ScrollCorner({ ...props }: ScrollCornerProps) {
  return (
    <ScrollAreaPrimitive.Corner {...props} data-slot="scroll-area-corner" />
  );
}
