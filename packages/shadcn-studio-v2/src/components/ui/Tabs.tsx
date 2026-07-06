// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface TabsProps extends ComponentProps<typeof TabsPrimitive.Root> {}
export interface TabsListProps
  extends ComponentProps<typeof TabsPrimitive.List> {
  readonly variant?: "default" | "underline";
}
export interface TabsTriggerProps
  extends ComponentProps<typeof TabsPrimitive.Tab> {}
export interface TabsContentProps
  extends ComponentProps<typeof TabsPrimitive.Panel> {}

const TABS_LIST_VARIANT_CLASSES = {
  default:
    "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  underline:
    "inline-flex items-center justify-center gap-1 border-b border-border text-muted-foreground",
} as const;

export function tabsListClassName({
  className,
  variant = "default",
}: {
  readonly className?: string;
  readonly variant?: TabsListProps["variant"];
} = {}): string {
  return cn(TABS_LIST_VARIANT_CLASSES[variant], className);
}

export function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      {...props}
      className={cn("grid gap-2", className)}
      data-slot="tabs"
    />
  );
}

export function TabsList({
  className,
  variant = "default",
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      {...props}
      className={tabsListClassName({ className, variant })}
      data-slot="tabs-list"
      data-variant={variant}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      {...props}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[variant=underline]:data-[selected]:border-primary data-[variant=underline]:data-[selected]:shadow-none data-[variant=underline]:rounded-none data-[variant=underline]:border-transparent data-[variant=underline]:border-b-2 data-[selected]:bg-background data-[variant=underline]:bg-transparent data-[variant=underline]:px-4 data-[selected]:text-foreground data-[selected]:shadow-sm",
        className
      )}
      data-slot="tabs-trigger"
    />
  );
}

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      {...props}
      className={cn(
        "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      data-slot="tabs-content"
    />
  );
}
