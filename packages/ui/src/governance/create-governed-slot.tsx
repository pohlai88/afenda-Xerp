import * as React from "react";

import type { SlotRole } from "./design-system";
import { applyGovernedPresentation } from "./governed-render";
import { resolvePrimitiveGovernance } from "./primitive-governance";
import type { GovernedRecipeName, GovernedUiComponentName } from "./types";

export interface GovernedSlotClassNameProps {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

export interface GovernedSlotFactoryInput {
  readonly componentName: GovernedUiComponentName;
  readonly recipeName: GovernedRecipeName;
  readonly slot?: SlotRole;
  readonly slotKey?: string;
}

function resolveSlotGovernance(
  input: GovernedSlotFactoryInput,
  className: string | undefined
) {
  if (input.slotKey !== undefined) {
    return resolvePrimitiveGovernance({
      componentName: input.componentName,
      recipeName: input.recipeName,
      slotKey: input.slotKey,
      className,
    });
  }

  return resolvePrimitiveGovernance({
    componentName: input.componentName,
    recipeName: input.recipeName,
    slot: input.slot ?? "root",
    className,
  });
}

export function createGovernedDivSlot(
  displayName: string,
  input: GovernedSlotFactoryInput
) {
  const GovernedDivSlot = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & GovernedSlotClassNameProps
  >(({ className, ...props }, ref) => {
    const governed = resolveSlotGovernance(input, className);

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  });

  GovernedDivSlot.displayName = displayName;

  return GovernedDivSlot;
}

export function createGovernedSpanSlot(
  displayName: string,
  input: GovernedSlotFactoryInput
) {
  const GovernedSpanSlot = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & GovernedSlotClassNameProps
  >(({ className, ...props }, ref) => {
    const governed = resolveSlotGovernance(input, className);

    return <span ref={ref} {...applyGovernedPresentation(props, governed)} />;
  });

  GovernedSpanSlot.displayName = displayName;

  return GovernedSpanSlot;
}
