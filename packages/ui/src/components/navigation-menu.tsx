"use client";

import type {
  GovernedNavigationMenuProps,
  SlotRole,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import * as React from "react";

const NAVIGATION_MENU_RECIPE_NAME = "surface" as const;

const NAVIGATION_MENU_SLOT_ROLES = {
  root: "root",
  body: "body",
  content: "content",
  control: "control",
  header: "header",
  label: "label",
  state: "state",
  footer: "footer",
  actions: "actions",
} as const satisfies Record<
  | "root"
  | "body"
  | "content"
  | "control"
  | "header"
  | "label"
  | "state"
  | "footer"
  | "actions",
  SlotRole
>;

export interface NavigationMenuListProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.body,
    className,
  });

  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

NavigationMenuList.displayName = "NavigationMenuList";

export interface NavigationMenuItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuItem = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Item>,
  NavigationMenuItemProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.content,
    className,
  });

  return (
    <NavigationMenuPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

NavigationMenuItem.displayName = "NavigationMenuItem";

export interface NavigationMenuTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.control,
    slotKey: "trigger-style",
    className,
  });

  const chevron = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slotKey: "trigger-chevron",
  });

  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      {children}{" "}
      <ChevronDownIcon
        aria-hidden="true"
        {...applyGovernedPresentation({}, chevron)}
      />
    </NavigationMenuPrimitive.Trigger>
  );
});

NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export interface NavigationMenuContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.header,
    className,
  });

  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

NavigationMenuContent.displayName = "NavigationMenuContent";

export interface NavigationMenuViewportProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => {
  const wrapper = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.footer,
  });

  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.actions,
    className,
  });

  return (
    <div {...applyGovernedPresentation({}, wrapper)}>
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        {...applyGovernedPresentation(props, governed)}
      />
    </div>
  );
});

NavigationMenuViewport.displayName = "NavigationMenuViewport";

export interface NavigationMenuLinkProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.label,
    className,
  });

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

NavigationMenuLink.displayName = "NavigationMenuLink";

export interface NavigationMenuIndicatorProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>,
    "className"
  > {
  readonly className?: string;
}

const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: NAVIGATION_MENU_SLOT_ROLES.state,
    className,
  });

  const arrow = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slotKey: "indicator-arrow",
  });

  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      <div {...applyGovernedPresentation({}, arrow)} />
    </NavigationMenuPrimitive.Indicator>
  );
});

NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export interface NavigationMenuProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>,
      "className"
    >,
    GovernedNavigationMenuProps {
  readonly className?: string;
  readonly viewport?: boolean;
}

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, state, viewport = true, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    state,
    slot: NAVIGATION_MENU_SLOT_ROLES.root,
    className,
  });

  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-viewport": viewport,
      })}
    >
      {children}
      {viewport ? <NavigationMenuViewport /> : null}
    </NavigationMenuPrimitive.Root>
  );
});

NavigationMenu.displayName = "NavigationMenu";

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
