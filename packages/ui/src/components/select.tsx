"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "#/lib/utils";
import type { GovernedSize } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const SELECT_RECIPE_NAME = "form-control" as const;

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

const SelectGroup = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Group>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: "body",
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
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

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
    slot: "control",
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
        <ChevronDownIcon {...applyGovernedPresentation({}, chevron)} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "className"> & {
    readonly className?: string;
  }
>(({ className, children, position = "item-aligned", align = "center", ...props }, ref) => {
  const popperOffset =
    position === "popper"
      ? resolvePrimitiveGovernance({
          componentName: "Select",
          recipeName: SELECT_RECIPE_NAME,
          slotKey: "content-popper",
        })
      : null;

  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: "root",
    className: cn(className, popperOffset?.className),
  });

  const viewportPopper =
    position === "popper"
      ? resolvePrimitiveGovernance({
          componentName: "Select",
          recipeName: SELECT_RECIPE_NAME,
          slotKey: "viewport-popper",
        })
      : null;

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
          {...(viewportPopper
            ? applyGovernedPresentation({ "data-position": position }, viewportPopper)
            : { "data-position": position })}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: "state",
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
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, "className"> & {
    readonly className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: "label",
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
          <CheckIcon {...applyGovernedPresentation({}, checkIcon)} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Select",
    recipeName: SELECT_RECIPE_NAME,
    slot: "footer",
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
    slot: "icon",
    className,
  });

  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <ChevronUpIcon />
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
      <ChevronDownIcon />
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
