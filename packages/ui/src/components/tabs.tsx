"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const TABS_RECIPE_NAME = "surface" as const;

export interface TabsProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, "className"> {
  readonly className?: string;
}

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, orientation = "horizontal", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <TabsPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-orientation": orientation,
      })}
    />
  );
});

Tabs.displayName = "Tabs";

export type TabsListVariant = "default" | "line";

export interface TabsListProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.List>, "className"> {
  readonly className?: string;
  readonly variant?: TabsListVariant;
}

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "default", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    slot: "header",
    slotKey: variant === "line" ? "list-line" : "list-default",
    className,
  });

  return (
    <TabsPrimitive.List
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-variant": variant,
      })}
    />
  );
});

TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.Trigger>, "className"> {
  readonly className?: string;
}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    slot: "control",
    className,
  });

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.Content>, "className"> {
  readonly className?: string;
}

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    slot: "content",
    className,
  });

  return (
    <TabsPrimitive.Content
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
