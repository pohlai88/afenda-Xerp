"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  TOOLTIP_SLOTS,
  tooltipArrowClassName,
  tooltipContentClassName,
  tooltipPositionerClassName,
} from "./tooltip.contract.js";

type TooltipProviderProps =
  WithoutGovernedDataSlot<TooltipPrimitive.Provider.Props>;
type TooltipProps = WithoutGovernedDataSlot<TooltipPrimitive.Root.Props>;
type TooltipTriggerProps =
  WithoutGovernedDataSlot<TooltipPrimitive.Trigger.Props>;
type TooltipContentProps =
  WithoutGovernedDataSlot<TooltipPrimitive.Popup.Props> &
    Pick<
      TooltipPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    >;

function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      {...props}
      data-slot={TOOLTIP_SLOTS.provider}
      delay={delay}
    />
  );
}

function Tooltip({ ...props }: TooltipProps) {
  return <TooltipPrimitive.Root {...props} data-slot={TOOLTIP_SLOTS.root} />;
}

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return (
    <TooltipPrimitive.Trigger {...props} data-slot={TOOLTIP_SLOTS.trigger} />
  );
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal data-slot={TOOLTIP_SLOTS.portal}>
      <TooltipPrimitive.Positioner
        {...{ align, alignOffset, side, sideOffset }}
        className={tooltipPositionerClassName}
        data-slot={TOOLTIP_SLOTS.positioner}
      >
        <TooltipPrimitive.Popup
          {...props}
          className={cn(tooltipContentClassName, className)}
          data-slot={TOOLTIP_SLOTS.content}
        >
          {children}
          <TooltipPrimitive.Arrow
            className={tooltipArrowClassName}
            data-slot={TOOLTIP_SLOTS.arrow}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export type { TooltipSlot } from "./tooltip.contract.js";
export type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
};
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
