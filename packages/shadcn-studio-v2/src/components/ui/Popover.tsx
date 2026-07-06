"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface PopoverProps
  extends ComponentProps<typeof PopoverPrimitive.Root> {}
export interface PopoverTriggerProps
  extends ComponentProps<typeof PopoverPrimitive.Trigger> {}
export interface PopoverContentProps
  extends Omit<ComponentProps<typeof PopoverPrimitive.Popup>, "className">,
    Pick<
      ComponentProps<typeof PopoverPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {
  readonly className?: string | undefined;
}
export interface PopoverHeaderProps extends ComponentProps<"div"> {}
export interface PopoverTitleProps
  extends Omit<ComponentProps<typeof PopoverPrimitive.Title>, "className"> {
  readonly className?: string | undefined;
}
export interface PopoverDescriptionProps
  extends Omit<
    ComponentProps<typeof PopoverPrimitive.Description>,
    "className"
  > {
  readonly className?: string | undefined;
}

const POPOVER_POSITIONER_CLASS = "z-50 outline-none";
const POPOVER_CONTENT_CLASS =
  "z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none focus-visible:outline-none";
const POPOVER_HEADER_CLASS = "grid gap-1.5";
const POPOVER_TITLE_CLASS = "font-medium leading-none";
const POPOVER_DESCRIPTION_CLASS = "text-muted-foreground text-sm";

export function popoverContentClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(POPOVER_CONTENT_CLASS, className);
}

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
        className={POPOVER_POSITIONER_CLASS}
        data-slot="popover-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          {...props}
          className={popoverContentClassName({ className })}
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
      className={cn(POPOVER_HEADER_CLASS, className)}
      data-slot="popover-header"
    />
  );
}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      {...props}
      className={cn(POPOVER_TITLE_CLASS, className)}
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
      className={cn(POPOVER_DESCRIPTION_CLASS, className)}
      data-slot="popover-description"
    />
  );
}
