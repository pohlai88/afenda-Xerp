// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface PopoverProps
  extends ComponentProps<typeof PopoverPrimitive.Root> {}
export interface PopoverTriggerProps
  extends ComponentProps<typeof PopoverPrimitive.Trigger> {}
export interface PopoverContentProps
  extends ComponentProps<typeof PopoverPrimitive.Popup>,
    Pick<
      ComponentProps<typeof PopoverPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {}
export interface PopoverHeaderProps extends ComponentProps<"div"> {}
export interface PopoverTitleProps
  extends ComponentProps<typeof PopoverPrimitive.Title> {}
export interface PopoverDescriptionProps
  extends ComponentProps<typeof PopoverPrimitive.Description> {}

export function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root {...props} data-slot="popover" />;
}

export function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger {...props} data-slot="popover-trigger" />;
}

export function PopoverContent({
  align = "center",
  alignOffset = 0,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal data-slot="popover-portal">
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50 outline-none"
        data-slot="popover-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          {...props}
          className={cn(
            "z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
            className
          )}
          data-slot="popover-content"
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      {...props}
      className={cn("grid gap-1.5", className)}
      data-slot="popover-header"
    />
  );
}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      {...props}
      className={cn("font-medium leading-none", className)}
      data-slot="popover-title"
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      {...props}
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="popover-description"
    />
  );
}
