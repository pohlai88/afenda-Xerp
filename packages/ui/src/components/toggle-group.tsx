"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "#/lib/utils";
import type { GovernedToggleProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const TOGGLE_GROUP_RECIPE_NAME = "form-control" as const;

const ToggleGroupContext = React.createContext<
  GovernedToggleProps & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
});

export interface ToggleGroupProps
  extends Omit<React.ComponentProps<typeof ToggleGroupPrimitive.Root>, "className"> {
  readonly className?: string;
  readonly variant?: GovernedToggleProps["variant"];
  readonly size?: GovernedToggleProps["size"];
  readonly spacing?: number;
  readonly orientation?: "horizontal" | "vertical";
}

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  style,
  ...props
}: ToggleGroupProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "ToggleGroup",
    recipeName: TOGGLE_GROUP_RECIPE_NAME,
    slot: "root",
    className,
  });

  const rootProps = {
    ...props,
    style: {
      "--gap": spacing,
      ...(style ?? {}),
    } as React.CSSProperties,
    ...(variant === undefined ? {} : { "data-variant": variant }),
    ...(size === undefined ? {} : { "data-size": size }),
    "data-spacing": spacing,
    "data-orientation": orientation,
    ...governed.dataAttributes,
    className: cn(governed.className),
    children: (
      <ToggleGroupContext.Provider
        value={{
          ...(variant === undefined ? {} : { variant }),
          ...(size === undefined ? {} : { size }),
          spacing,
          orientation,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    ),
  } as React.ComponentProps<typeof ToggleGroupPrimitive.Root>;

  return <ToggleGroupPrimitive.Root {...rootProps} />;
}

export interface ToggleGroupItemProps
  extends Omit<React.ComponentProps<typeof ToggleGroupPrimitive.Item>, "className">,
    GovernedToggleProps {
  readonly className?: string;
}

const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant = "default", size = "default", state, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = context.variant ?? variant;
  const resolvedSize = context.size ?? size;

  const governed = resolvePrimitiveGovernance({
    componentName: "ToggleGroup",
    recipeName: TOGGLE_GROUP_RECIPE_NAME,
    state,
    slot: "control",
    toggleVariant: resolvedVariant,
    toggleSize: resolvedSize,
    className,
  });

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-variant": resolvedVariant,
        "data-size": resolvedSize,
        "data-spacing": context.spacing,
      })}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
