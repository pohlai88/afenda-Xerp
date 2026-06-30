"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import { type ToggleVariantProps, toggleVariants } from "./toggle.contract.js";
import {
  TOGGLE_GROUP_SLOTS,
  toggleGroupItemSpacingClassName,
  toggleGroupRootClassName,
} from "./toggle-group.contract.js";

type ToggleGroupProps = WithoutGovernedDataSlot<ToggleGroupPrimitive.Props> &
  ToggleVariantProps & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  };
type ToggleGroupItemProps = WithoutGovernedDataSlot<TogglePrimitive.Props> &
  ToggleVariantProps;

const ToggleGroupContext = React.createContext<
  ToggleVariantProps & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      {...props}
      className={cn(toggleGroupRootClassName, className)}
      data-orientation={orientation}
      data-size={size}
      data-slot={TOGGLE_GROUP_SLOTS.root}
      data-spacing={spacing}
      data-variant={variant}
      style={{ "--gap": spacing } as React.CSSProperties}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      {...props}
      className={cn(
        toggleGroupItemSpacingClassName,
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      data-size={context.size || size}
      data-slot={TOGGLE_GROUP_SLOTS.item}
      data-spacing={context.spacing}
      data-variant={context.variant || variant}
    >
      {children}
    </TogglePrimitive>
  );
}

export type { ToggleGroupSlot } from "./toggle-group.contract.js";
export type { ToggleGroupItemProps, ToggleGroupProps };
export { ToggleGroup, ToggleGroupItem };
