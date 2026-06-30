"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";

import { COLLAPSIBLE_SLOTS } from "./collapsible.contract.js";

type CollapsibleProps =
  WithoutGovernedDataSlot<CollapsiblePrimitive.Root.Props>;
type CollapsibleTriggerProps =
  WithoutGovernedDataSlot<CollapsiblePrimitive.Trigger.Props>;
type CollapsibleContentProps =
  WithoutGovernedDataSlot<CollapsiblePrimitive.Panel.Props>;

function Collapsible({ ...props }: CollapsibleProps) {
  return (
    <CollapsiblePrimitive.Root {...props} data-slot={COLLAPSIBLE_SLOTS.root} />
  );
}

function CollapsibleTrigger({ ...props }: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      data-slot={COLLAPSIBLE_SLOTS.trigger}
    />
  );
}

function CollapsibleContent({ ...props }: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.Panel
      {...props}
      data-slot={COLLAPSIBLE_SLOTS.content}
    />
  );
}

export type { CollapsibleSlot } from "./collapsible.contract.js";
export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
};
export { Collapsible, CollapsibleContent, CollapsibleTrigger };
