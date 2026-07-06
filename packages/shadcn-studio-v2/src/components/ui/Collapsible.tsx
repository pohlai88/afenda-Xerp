// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type { ComponentProps } from "react";

export interface CollapsibleProps
  extends ComponentProps<typeof CollapsiblePrimitive.Root> {}
export interface CollapsibleTriggerProps
  extends ComponentProps<typeof CollapsiblePrimitive.Trigger> {}
export interface CollapsibleContentProps
  extends ComponentProps<typeof CollapsiblePrimitive.Panel> {}

export function Collapsible({ ...props }: CollapsibleProps) {
  return <CollapsiblePrimitive.Root {...props} data-slot="collapsible" />;
}

export function CollapsibleTrigger({ ...props }: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger {...props} data-slot="collapsible-trigger" />
  );
}

export function CollapsibleContent({ ...props }: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.Panel {...props} data-slot="collapsible-content" />
  );
}
