"use client";

import type { GovernedFormControlProps } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

const RADIO_GROUP_RECIPE_NAME = "form-control" as const;

export interface RadioGroupProps
  extends Omit<
      React.ComponentProps<typeof RadioGroupPrimitive.Root>,
      "className"
    >,
    GovernedFormControlProps {
  readonly className?: string;
}

export interface RadioGroupItemProps
  extends Omit<
      React.ComponentProps<typeof RadioGroupPrimitive.Item>,
      "className"
    >,
    GovernedFormControlProps {
  readonly className?: string;
}

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "RadioGroup",
    recipeName: RADIO_GROUP_RECIPE_NAME,
    state,
    slot: "root",
    className,
  });

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "RadioGroup",
    recipeName: RADIO_GROUP_RECIPE_NAME,
    state,
    slot: "control",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "RadioGroup",
    recipeName: RADIO_GROUP_RECIPE_NAME,
    slotKey: "indicator",
  });

  const indicatorDot = resolvePrimitiveGovernance({
    componentName: "RadioGroup",
    recipeName: RADIO_GROUP_RECIPE_NAME,
    slotKey: "indicator-dot",
  });

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <RadioGroupPrimitive.Indicator
        {...applyGovernedPresentation({}, indicator)}
      >
        <span {...applyGovernedPresentation({}, indicatorDot)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
