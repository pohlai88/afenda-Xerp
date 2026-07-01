"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  TABS_SLOTS,
  type TabsListVariantProps,
  tabsContentClassName,
  tabsListVariants,
  tabsRootClassName,
  tabsTriggerClassName,
} from "./tabs.contract.js";

type TabsProps = WithoutGovernedDataSlot<TabsPrimitive.Root.Props>;
type TabsListProps = WithoutGovernedDataSlot<TabsPrimitive.List.Props> &
  TabsListVariantProps;
type TabsTriggerProps = WithoutGovernedDataSlot<TabsPrimitive.Tab.Props>;
type TabsContentProps = WithoutGovernedDataSlot<TabsPrimitive.Panel.Props>;

function Tabs({ className, orientation = "horizontal", ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      {...props}
      className={cn(tabsRootClassName, className)}
      data-orientation={orientation}
      data-slot={TABS_SLOTS.root}
    />
  );
}

function TabsList({ className, variant = "default", ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      {...props}
      className={cn(tabsListVariants({ variant }), className)}
      data-slot={TABS_SLOTS.list}
      data-variant={variant}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      {...props}
      className={cn(tabsTriggerClassName, className)}
      data-slot={TABS_SLOTS.trigger}
    />
  );
}

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      {...props}
      className={cn(tabsContentClassName, className)}
      data-slot={TABS_SLOTS.content}
    />
  );
}

export type { TabsSlot } from "./tabs.contract.js";
export type {
  TabsContentProps,
  TabsListProps,
  TabsListVariantProps,
  TabsProps,
  TabsTriggerProps,
};
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
