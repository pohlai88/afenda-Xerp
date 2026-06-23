"use client";

import type { GovernedTabsProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

const TABS_RECIPE_NAME = "surface" as const;

const TABS_SLOT_ROLES = {
  root: "root",
  list: "header",
  trigger: "control",
  content: "content",
} as const satisfies Record<string, SlotRole>;

export type TabsListVariant = "default" | "line";

const TABS_LIST_SLOT_KEYS = {
  default: "list-default",
  line: "list-line",
} as const satisfies Record<TabsListVariant, "list-default" | "list-line">;

export type TabsProps = Omit<
  React.ComponentProps<typeof TabsPrimitive.Root>,
  "className"
> &
  GovernedTabsProps & {
    readonly className?: string;
  };

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, orientation = "horizontal", state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    state,
    slot: TABS_SLOT_ROLES.root,
    className,
  });

  return (
    <TabsPrimitive.Root
      orientation={orientation}
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-orientation": orientation,
      })}
    />
  );
});

Tabs.displayName = "Tabs";

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
    slot: TABS_SLOT_ROLES.list,
    slotKey: TABS_LIST_SLOT_KEYS[variant],
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
  extends Omit<
    React.ComponentProps<typeof TabsPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string;
}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    slot: TABS_SLOT_ROLES.trigger,
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
  extends Omit<
    React.ComponentProps<typeof TabsPrimitive.Content>,
    "className"
  > {
  readonly className?: string;
}

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Tabs",
    recipeName: TABS_RECIPE_NAME,
    slot: TABS_SLOT_ROLES.content,
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

export { Tabs, TabsContent, TabsList, TabsTrigger };
