"use client";

import type {
  GovernedToggleGroupProps,
  GovernedToggleProps,
  SlotRole,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

const TOGGLE_GROUP_RECIPE_NAME = "form-control" as const;

const TOGGLE_GROUP_SLOT_ROLES = {
  root: "root",
  item: "control",
} as const satisfies Record<string, SlotRole>;

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
  extends Omit<
      React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
      "className"
    >,
    GovernedToggleGroupProps {
  readonly className?: string;
  readonly orientation?: "horizontal" | "vertical";
  readonly size?: GovernedToggleProps["size"];
  readonly spacing?: number;
  readonly variant?: GovernedToggleProps["variant"];
}

const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    {
      className,
      variant,
      size,
      spacing = 2,
      orientation = "horizontal",
      state,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "ToggleGroup",
      recipeName: TOGGLE_GROUP_RECIPE_NAME,
      slot: TOGGLE_GROUP_SLOT_ROLES.root,
      state,
      className,
    });

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        orientation={orientation}
        style={
          {
            "--gap": spacing,
            ...(style ?? {}),
          } as React.CSSProperties
        }
        {...applyGovernedPresentation(props, governed, {
          "data-orientation": orientation,
          "data-size": size,
          "data-spacing": spacing,
          "data-variant": variant,
        })}
      >
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
      </ToggleGroupPrimitive.Root>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends Omit<
      React.ComponentProps<typeof ToggleGroupPrimitive.Item>,
      "className"
    >,
    GovernedToggleProps {
  readonly className?: string;
}

const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      state,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ToggleGroupContext);
    const resolvedVariant = context.variant ?? variant;
    const resolvedSize = context.size ?? size;

    const governed = resolvePrimitiveGovernance({
      componentName: "ToggleGroup",
      recipeName: TOGGLE_GROUP_RECIPE_NAME,
      state,
      slot: TOGGLE_GROUP_SLOT_ROLES.item,
      toggleVariant: resolvedVariant,
      toggleSize: resolvedSize,
      className,
    });

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-size": resolvedSize,
          "data-spacing": context.spacing,
          "data-variant": resolvedVariant,
        })}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
