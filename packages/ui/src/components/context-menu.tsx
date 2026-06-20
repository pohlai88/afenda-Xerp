"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { createGovernedSpanSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const CONTEXT_MENU_RECIPE_NAME = "surface" as const;

const ContextMenuShortcut = createGovernedSpanSlot("ContextMenuShortcut", {
  componentName: "ContextMenu",
  recipeName: CONTEXT_MENU_RECIPE_NAME,
  slot: "actions",
});

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

const ContextMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Trigger>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "trigger",
    slot: "control",
    className,
  });

  return (
    <ContextMenuPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

ContextMenuTrigger.displayName = "ContextMenuTrigger";

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        {...applyGovernedPresentation(props, governed)}
      />
    </ContextMenuPrimitive.Portal>
  );
});

ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
    readonly variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slot: "control",
    className,
  });

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-inset": inset,
        "data-variant": variant,
      })}
    />
  );
});

ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "sub-trigger",
    slot: "control",
    className,
  });

  const chevron = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "sub-trigger-chevron",
  });

  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    >
      {children}
      <ChevronRightIcon {...applyGovernedPresentation({}, chevron)} />
    </ContextMenuPrimitive.SubTrigger>
  );
});

ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubContent>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slot: "content",
    className,
  });

  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

ContextMenuSubContent.displayName = "ContextMenuSubContent";

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, children, checked, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "checkbox-item",
    slot: "control",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, ...(checked !== undefined ? { checked } : {}) },
        governed,
        { "data-inset": inset }
      )}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});

ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, children, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "radio-item",
    slot: "control",
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});

ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Label>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slot: "state",
    className,
  });

  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    />
  );
});

ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Separator>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "ContextMenu",
    recipeName: CONTEXT_MENU_RECIPE_NAME,
    slot: "footer",
    className,
  });

  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

ContextMenuSeparator.displayName = "ContextMenuSeparator";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
