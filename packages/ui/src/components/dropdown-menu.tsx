"use client";

import type { GovernedDropdownMenuProps } from "@afenda/ui/governance";
import { createGovernedSpanSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";

const DROPDOWN_MENU_RECIPE_NAME = "surface" as const;

const DropdownMenuShortcut = createGovernedSpanSlot("DropdownMenuShortcut", {
  componentName: "DropdownMenu",
  recipeName: DROPDOWN_MENU_RECIPE_NAME,
  slot: "actions",
});

export interface DropdownMenuProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>,
    "className"
  >,
    GovernedDropdownMenuProps {
  readonly className?: string;
}

function DropdownMenu({ className, state, ...props }: DropdownMenuProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "menu-root",
    state,
    className,
  });

  return (
    <DropdownMenuPrimitive.Root
      {...applyGovernedPresentation(props, governed)}
    />
  );
}

DropdownMenu.displayName = "DropdownMenu";

export interface DropdownMenuTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
}

const DropdownMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "trigger",
    slot: "control",
    className,
  });

  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

DropdownMenuGroup.displayName = "DropdownMenuGroup";

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

DropdownMenuPortal.displayName = "DropdownMenuPortal";

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

DropdownMenuSub.displayName = "DropdownMenuSub";

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

export interface DropdownMenuContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    "className"
  > {
  readonly className?: string;
}

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        {...applyGovernedPresentation(
          { ...props, align, sideOffset },
          governed
        )}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    "className"
  > {
  readonly className?: string;
  readonly inset?: boolean;
  readonly variant?: "default" | "destructive";
}

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, variant = "default", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slot: "control",
    className,
  });

  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-inset": inset,
        "data-variant": variant,
      })}
    />
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, children, checked, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "checkbox-item",
    slot: "control",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, ...(checked === undefined ? {} : { checked }) },
        governed,
        { "data-inset": inset }
      )}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, children, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "radio-item",
    slot: "control",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slot: "state",
    className,
  });

  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    />
  );
});

DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slot: "footer",
    className,
  });

  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "sub-trigger",
    slot: "control",
    className,
  });

  const chevron = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slotKey: "sub-trigger-chevron",
  });

  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    >
      {children}
      <ChevronRightIcon
        aria-hidden="true"
        {...applyGovernedPresentation({}, chevron)}
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
});

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "DropdownMenu",
    recipeName: DROPDOWN_MENU_RECIPE_NAME,
    slot: "content",
    className,
  });

  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
