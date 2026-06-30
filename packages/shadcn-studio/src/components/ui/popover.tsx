"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  POPOVER_SLOTS,
  popoverContentClassName,
  popoverDescriptionClassName,
  popoverHeaderClassName,
  popoverPositionerClassName,
  popoverTitleClassName,
} from "./popover.contract.js";

type PopoverProps = WithoutGovernedDataSlot<PopoverPrimitive.Root.Props>;
type PopoverTriggerProps =
  WithoutGovernedDataSlot<PopoverPrimitive.Trigger.Props>;
type PopoverContentProps = WithoutGovernedDataSlot<
  PopoverPrimitive.Popup.Props &
    Pick<
      PopoverPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    >
>;
type PopoverHeaderProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type PopoverTitleProps = WithoutGovernedDataSlot<PopoverPrimitive.Title.Props>;
type PopoverDescriptionProps =
  WithoutGovernedDataSlot<PopoverPrimitive.Description.Props>;

function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root {...props} data-slot={POPOVER_SLOTS.root} />;
}

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return (
    <PopoverPrimitive.Trigger {...props} data-slot={POPOVER_SLOTS.trigger} />
  );
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal data-slot={POPOVER_SLOTS.portal}>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={popoverPositionerClassName}
        data-slot={POPOVER_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          {...props}
          className={cn(popoverContentClassName, className)}
          data-slot={POPOVER_SLOTS.content}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      {...props}
      className={cn(popoverHeaderClassName, className)}
      data-slot={POPOVER_SLOTS.header}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      {...props}
      className={cn(popoverTitleClassName, className)}
      data-slot={POPOVER_SLOTS.title}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      {...props}
      className={cn(popoverDescriptionClassName, className)}
      data-slot={POPOVER_SLOTS.description}
    />
  );
}

export type { PopoverSlot } from "./popover.contract.js";
export type {
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverHeaderProps,
  PopoverProps,
  PopoverTitleProps,
  PopoverTriggerProps,
};
export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
