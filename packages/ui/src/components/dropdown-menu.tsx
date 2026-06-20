"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { createGovernedSpanSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const DROPDOWN_MENU_RECIPE_NAME = "surface" as const;

const DropdownMenuShortcut = createGovernedSpanSlot("DropdownMenuShortcut", {
  componentName: "DropdownMenu",
  recipeName: DROPDOWN_MENU_RECIPE_NAME,
  slot: "actions",
});

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    "className"
  > & {
    readonly className?: string;
  }
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
        {...applyGovernedPresentation({ ...props, align, sideOffset }, governed)}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
    readonly variant?: "default" | "destructive";
  }
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
        { ...props, ...(checked !== undefined ? { checked } : {}) },
        governed,
        { "data-inset": inset }
      )}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

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
          <CheckIcon />
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

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

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
      <ChevronRightIcon {...applyGovernedPresentation({}, chevron)} />
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
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
