// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ScrollAreaProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Root> {}
export interface ScrollAreaViewportProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Viewport> {}
export interface ScrollBarProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Scrollbar> {}
export interface ScrollThumbProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Thumb> {}
export interface ScrollCornerProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Corner> {}

export function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={cn(
        "relative overflow-hidden",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "size-full rounded-[inherit]",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "flex touch-none select-none p-0.5 transition-colors",
        orientation === "horizontal"
          ? "h-2.5 flex-col border-t border-t-transparent"
          : "w-2.5 border-l border-l-transparent",
        typeof className === "string" ? className : undefined
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
    />
  );
}

export function ScrollThumb({ className, ...props }: ScrollThumbProps) {
  return (
    <ScrollAreaPrimitive.Thumb
      {...props}
      className={cn(
        "relative flex-1 rounded-full bg-border",
        typeof className === "string" ? className : undefined
      )}
      data-slot="scroll-area-thumb"
    />
  );
}

export function ScrollCorner({ ...props }: ScrollCornerProps) {
  return (
    <ScrollAreaPrimitive.Corner {...props} data-slot="scroll-area-corner" />
  );
}
