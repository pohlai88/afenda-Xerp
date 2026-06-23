"use client";

import type { GovernedMenubarProps, SlotRole } from "@afenda/ui/governance";
import { createGovernedSpanSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";
import * as React from "react";

const MENUBAR_RECIPE_NAME = "surface" as const;

const MENUBAR_SLOT_ROLES = {
  root: "root",
  content: "content",
  control: "control",
  state: "state",
  footer: "footer",
  actions: "actions",
} as const satisfies Record<
  "root" | "content" | "control" | "state" | "footer" | "actions",
  SlotRole
>;

const MenubarShortcut = createGovernedSpanSlot("MenubarShortcut", {
  componentName: "Menubar",
  recipeName: MENUBAR_RECIPE_NAME,
  slot: MENUBAR_SLOT_ROLES.actions,
});

export interface MenubarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>,
      "className"
    >,
    GovernedMenubarProps {
  readonly className?: string;
}

const Menubar = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Root>,
  MenubarProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    state,
    slot: MENUBAR_SLOT_ROLES.root,
    className,
  });

  return (
    <MenubarPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

Menubar.displayName = "Menubar";

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

export interface MenubarTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
}

const MenubarTrigger = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Trigger>,
  MenubarTriggerProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "trigger",
    slot: MENUBAR_SLOT_ROLES.control,
    className,
  });

  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

MenubarTrigger.displayName = "MenubarTrigger";

export interface MenubarContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>,
    "className"
  > {
  readonly className?: string;
}

const MenubarContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Content>,
  MenubarContentProps
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Menubar",
      recipeName: MENUBAR_RECIPE_NAME,
      slot: MENUBAR_SLOT_ROLES.content,
      className,
    });

    return (
      <MenubarPortal>
        <MenubarPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(
            { ...props, align, alignOffset, sideOffset },
            governed
          )}
        />
      </MenubarPortal>
    );
  }
);

MenubarContent.displayName = "MenubarContent";

export interface MenubarItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>,
    "className"
  > {
  readonly className?: string;
  readonly inset?: boolean;
  readonly variant?: "default" | "destructive";
}

const MenubarItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Item>,
  MenubarItemProps
>(({ className, inset, variant = "default", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slot: MENUBAR_SLOT_ROLES.control,
    className,
  });

  return (
    <MenubarPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-inset": inset,
        "data-variant": variant,
      })}
    />
  );
});

MenubarItem.displayName = "MenubarItem";

const MenubarCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.CheckboxItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, children, checked, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "checkbox-item",
    slot: MENUBAR_SLOT_ROLES.control,
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  return (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, ...(checked === undefined ? {} : { checked }) },
        governed,
        { "data-inset": inset }
      )}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});

MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

const MenubarRadioItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.RadioItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, children, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "radio-item",
    slot: MENUBAR_SLOT_ROLES.control,
    className,
  });

  const indicator = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "item-indicator",
  });

  return (
    <MenubarPrimitive.RadioItem
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    >
      <span {...applyGovernedPresentation({}, indicator)}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});

MenubarRadioItem.displayName = "MenubarRadioItem";

const MenubarLabel = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Label>,
  Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slot: MENUBAR_SLOT_ROLES.state,
    className,
  });

  return (
    <MenubarPrimitive.Label
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    />
  );
});

MenubarLabel.displayName = "MenubarLabel";

const MenubarSeparator = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Separator>,
  Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slot: MENUBAR_SLOT_ROLES.footer,
    className,
  });

  return (
    <MenubarPrimitive.Separator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

MenubarSeparator.displayName = "MenubarSeparator";

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const MenubarSubTrigger = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.SubTrigger>,
  Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>,
    "className"
  > & {
    readonly className?: string;
    readonly inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "sub-trigger",
    slot: MENUBAR_SLOT_ROLES.control,
    className,
  });

  const chevron = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "sub-trigger-chevron",
  });

  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-inset": inset })}
    >
      {children}
      <ChevronRightIcon
        aria-hidden="true"
        {...applyGovernedPresentation({}, chevron)}
      />
    </MenubarPrimitive.SubTrigger>
  );
});

MenubarSubTrigger.displayName = "MenubarSubTrigger";

const MenubarSubContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.SubContent>,
  Omit<
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Menubar",
    recipeName: MENUBAR_RECIPE_NAME,
    slotKey: "sub-content",
    slot: MENUBAR_SLOT_ROLES.content,
    className,
  });

  return (
    <MenubarPrimitive.SubContent
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

MenubarSubContent.displayName = "MenubarSubContent";

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
