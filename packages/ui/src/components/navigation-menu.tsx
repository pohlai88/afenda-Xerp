"use client";

import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";

import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const NAVIGATION_MENU_RECIPE_NAME = "surface" as const;

const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "body",
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

const NavigationMenuItem = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Item>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "content",
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

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "control",
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
        {...applyGovernedPresentation({ "aria-hidden": true }, chevron)}
      />
    </NavigationMenuPrimitive.Trigger>
  );
});

NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "header",
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

const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const wrapper = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "footer",
  });

  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "actions",
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

const NavigationMenuLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Link>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "label",
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

const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "state",
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

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    readonly viewport?: boolean;
  }
>(({ className, children, viewport = true, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "NavigationMenu",
    recipeName: NAVIGATION_MENU_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-viewport": viewport })}
    >
      {children}
      {viewport ? <NavigationMenuViewport /> : null}
    </NavigationMenuPrimitive.Root>
  );
});

NavigationMenu.displayName = "NavigationMenu";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
