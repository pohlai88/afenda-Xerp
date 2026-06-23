"use client";

import type {
  GovernedSelectProps,
  GovernedSize,
  SlotRole,
} from "@afenda/ui/governance";
import {
  applyGovernedPresentation,
  mergeGovernedPresentation,
} from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import * as React from "react";

const SELECT_RECIPE_NAME = "form-control" as const;

const SELECT_SLOT_ROLES = {
  root: "root",
  control: "control",
  body: "body",
  state: "state",
  label: "label",
  footer: "footer",
  icon: "icon",
} as const satisfies Record<string, SlotRole>;

export interface SelectProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    "className"
  >,
    GovernedSelectProps {
  readonly className?: string;
}

function Select({ className, state, ...props }: SelectProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slotKey: "select-root",
    state,
    className,
  });

  return (
    <SelectPrimitive.Root {...applyGovernedPresentation(props, governed)} />
  );
}
Select.displayName = "Select";

const SelectGroup = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Group>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: SELECT_SLOT_ROLES.body,
    className,
  });

  return (
    <SelectPrimitive.Group
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

SelectGroup.displayName = "SelectGroup";

function SelectValue({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Value>, "className"> & {
  readonly className?: string;
}) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slotKey: "select-value",
    className,
  });

  return (
    <SelectPrimitive.Value {...applyGovernedPresentation(props, governed)} />
  );
}
SelectValue.displayName = "SelectValue";

export interface SelectTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
  readonly size?: Extract<GovernedSize, "sm" | "md"> | "default";
}

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, size = "md", children, ...props }, ref) => {
  const governedSize = size === "default" || size === "md" ? "md" : "sm";
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    variant: { size: governedSize },
    slot: SELECT_SLOT_ROLES.control,
    className,
  });

  const chevron = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slotKey: "trigger-chevron",
  });

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-size": governedSize === "sm" ? "sm" : "default",
      })}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          aria-hidden="true"
          {...applyGovernedPresentation({}, chevron)}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    "className"
  > & {
    readonly className?: string;
  }
>(
  (
    {
      className,
      children,
      position = "item-aligned",
      align = "center",
      ...props
    },
    ref
  ) => {
    const baseGoverned = resolvePrimitiveGovernance({
      componentName: "Select",
      recipeName: SELECT_RECIPE_NAME,
      slot: SELECT_SLOT_ROLES.root,
      className,
    });

    const popperOffset =
      position === "popper"
        ? resolvePrimitiveGovernance({
            componentName: "Select",
            recipeName: SELECT_RECIPE_NAME,
            slotKey: "content-popper",
          })
        : null;

    const governed = popperOffset
      ? mergeGovernedPresentation(baseGoverned, popperOffset)
      : baseGoverned;

    const viewportGoverned = resolvePrimitiveGovernance({
      componentName: "Select",
      recipeName: SELECT_RECIPE_NAME,
      slotKey: position === "popper" ? "viewport-popper" : "viewport",
    });

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(
            { ...props, align, position },
            governed,
            { "data-align-trigger": position === "item-aligned" }
          )}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            {...applyGovernedPresentation(
              { "data-position": position },
              viewportGoverned
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);

SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: SELECT_SLOT_ROLES.state,
    className,
  });

  return (
    <SelectPrimitive.Label
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: SELECT_SLOT_ROLES.label,
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  const checkIcon = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slotKey: "item-check-icon",
  });

  return (
    <SelectPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            aria-hidden="true"
            {...applyGovernedPresentation({}, checkIcon)}
          />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: SELECT_SLOT_ROLES.footer,
    className,
  });

  return (
    <SelectPrimitive.Separator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

SelectSeparator.displayName = "SelectSeparator";

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: SELECT_SLOT_ROLES.icon,
    className,
  });

  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <ChevronUpIcon aria-hidden="true" />
    </SelectPrimitive.ScrollUpButton>
  );
});

SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slotKey: "scroll-down",
    className,
  });

  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <ChevronDownIcon aria-hidden="true" />
    </SelectPrimitive.ScrollDownButton>
  );
});

SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
