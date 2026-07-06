"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface CollapsibleProps
  extends ComponentProps<typeof CollapsiblePrimitive.Root> {}
export interface CollapsibleTriggerProps
  extends Omit<
    ComponentProps<typeof CollapsiblePrimitive.Trigger>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface CollapsibleContentProps
  extends Omit<ComponentProps<typeof CollapsiblePrimitive.Panel>, "className"> {
  readonly className?: string | undefined;
}

const COLLAPSIBLE_TRIGGER_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function collapsibleTriggerClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(COLLAPSIBLE_TRIGGER_CLASS, className);
}

export function collapsibleContentClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(className);
}

export function Collapsible({ ...props }: CollapsibleProps) {
  return <CollapsiblePrimitive.Root {...props} data-slot="collapsible" />;
}

export function CollapsibleTrigger({
  className,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      className={collapsibleTriggerClassName({ className })}
      data-slot="collapsible-trigger"
    />
  );
}

export function CollapsibleContent({
  className,
  ...props
}: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.Panel
      {...props}
      className={collapsibleContentClassName({ className })}
      data-slot="collapsible-content"
    />
  );
}
