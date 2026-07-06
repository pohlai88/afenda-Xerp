// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface TooltipProviderProps
  extends ComponentProps<typeof TooltipPrimitive.Provider> {
  readonly delay?: number;
}
export interface TooltipProps
  extends ComponentProps<typeof TooltipPrimitive.Root> {}
export interface TooltipTriggerProps
  extends ComponentProps<typeof TooltipPrimitive.Trigger> {}
export interface TooltipContentProps
  extends ComponentProps<typeof TooltipPrimitive.Popup>,
    Pick<
      ComponentProps<typeof TooltipPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {}

export function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      {...props}
      data-slot="tooltip-provider"
      delay={delay}
    />
  );
}

export function Tooltip({ ...props }: TooltipProps) {
  return <TooltipPrimitive.Root {...props} data-slot="tooltip" />;
}

export function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger {...props} data-slot="tooltip-trigger" />;
}

export function TooltipContent({
  align = "center",
  alignOffset = 0,
  children,
  className,
  side = "top",
  sideOffset = 4,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal data-slot="tooltip-portal">
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50 outline-none"
        data-slot="tooltip-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          {...props}
          className={cn(
            "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs shadow-md",
            className
          )}
          data-slot="tooltip-content"
        >
          {children}
          <TooltipPrimitive.Arrow
            className="fill-primary data-[side=bottom]:top-0 data-[side=left]:right-0 data-[side=top]:bottom-0 data-[side=right]:left-0"
            data-slot="tooltip-arrow"
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}
