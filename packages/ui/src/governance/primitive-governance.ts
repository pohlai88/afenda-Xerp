import { cn } from "../lib/utils";

import { getComponentAccessibilityRequirement } from "./accessibility";
import { resolveLayoutClassName } from "./class-name";
import type { MotionContract, SlotRole } from "./design-system";
import { resolveMotionIntent } from "./motion";
import type {
  FieldOrientation,
  GovernedPrimitiveDefinition,
  PrimitiveGovernanceInput,
  PrimitiveGovernanceResult,
} from "./primitive-contract";
import {
  getPrimitiveDefinition,
  isGovernedPrimitive,
} from "./primitive-registry";
import {
  resolveButtonClassName,
  resolveFieldOrientationClassName,
  resolveGovernedRecipe,
} from "./recipe";
import { resolveGovernedState } from "./state";
import { resolveSlotRole } from "./slot";
import type { GovernedUiComponentName } from "./types";

function assertGovernedComponentName(
  componentName: string
): asserts componentName is GovernedUiComponentName {
  if (!isGovernedPrimitive(componentName)) {
    throw new Error(
      `TIP-004B primitive governance violation. Unknown governed component "${componentName}". Register it in GOVERNED_PRIMITIVE_REGISTRY before calling resolvePrimitiveGovernance().`
    );
  }
}

function assertPrimitiveSlotAllowed(
  definition: GovernedPrimitiveDefinition,
  slot: SlotRole
): void {
  if (!definition.slots.includes(slot)) {
    throw new Error(
      `TIP-004B primitive slot violation. Component "${definition.componentName}" does not allow slot "${slot}". Allowed slots: ${definition.slots.join(
        ", "
      )}.`
    );
  }
}

function resolveRecipeClassName(
  input: PrimitiveGovernanceInput,
  definition: GovernedPrimitiveDefinition
): string {
  if (
    input.slotKey !== undefined &&
    input.variant === undefined &&
    input.recipeName === undefined &&
    input.fieldOrientation === undefined
  ) {
    return "";
  }

  const recipeName = input.recipeName ?? definition.recipeName;
  const variant = input.variant ?? {};

  if (definition.controlPresentation === "leaf") {
    return "";
  }

  if (recipeName === "button") {
    return resolveButtonClassName({
      ...variant,
      ...(input.presentation === undefined
        ? {}
        : { presentation: input.presentation }),
    });
  }

  const recipe = resolveGovernedRecipe(recipeName, variant);

  if (input.componentName === "Field" && input.fieldOrientation !== undefined) {
    return cn(
      recipe.className,
      "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
      resolveFieldOrientationClassName(input.fieldOrientation)
    );
  }

  if (input.componentName === "Field" && input.slot === "root") {
    return cn(
      recipe.className,
      "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
      resolveFieldOrientationClassName("vertical")
    );
  }

  return recipe.className;
}

function resolveSlotClassName(
  input: PrimitiveGovernanceInput,
  definition: GovernedPrimitiveDefinition,
  slot: SlotRole
): string {
  if (input.slotKey !== undefined) {
    const slotClassName = definition.slotClassNamesByKey?.[input.slotKey];

    if (!slotClassName) {
      throw new Error(
        `TIP-004B primitive slot key violation. Component "${definition.componentName}" does not define slotKey "${input.slotKey}".`
      );
    }

    return slotClassName;
  }

  const baseClassName = definition.slotClassNames[slot] ?? "";
  const size = input.variant?.size;

  if (definition.controlPresentation === "leaf" && size !== undefined) {
    if (definition.componentName === "Switch") {
      const switchSizeKey = size === "sm" ? "size-sm" : "size-md";
      return cn(baseClassName, definition.slotClassNamesByKey?.[switchSizeKey]);
    }

    const leafSizeClassName = definition.slotClassNamesByKey?.[size];
    return cn(baseClassName, leafSizeClassName);
  }

  return baseClassName;
}

function resolveDataSlot(
  input: PrimitiveGovernanceInput,
  definition: GovernedPrimitiveDefinition,
  slot: SlotRole
): string {
  if (input.slotKey !== undefined) {
    const dataSlot = definition.dataSlotByKey?.[input.slotKey];

    if (!dataSlot) {
      throw new Error(
        `TIP-004B primitive slot key violation. Component "${definition.componentName}" does not define slotKey "${input.slotKey}".`
      );
    }

    return dataSlot;
  }

  return (
    definition.dataSlotByRole[slot] ??
    definition.dataSlotByRole[definition.defaultSlot] ??
    definition.componentName.toLowerCase()
  );
}

function buildDataAttributes(
  input: PrimitiveGovernanceInput,
  definition: GovernedPrimitiveDefinition,
  recipeName: PrimitiveGovernanceResult["recipeName"],
  state: PrimitiveGovernanceResult["state"],
  slot: PrimitiveGovernanceResult["slot"]
): Readonly<Record<string, string>> {
  return {
    "data-component": input.componentName,
    "data-recipe": recipeName,
    "data-state": state,
    "data-slot": resolveDataSlot(input, definition, slot),
  };
}

function resolvePrimitiveMotion(
  input: PrimitiveGovernanceInput,
  definition: GovernedPrimitiveDefinition
): MotionContract {
  return resolveMotionIntent(input.motion, definition.motion);
}

export function resolvePrimitiveGovernance(
  input: PrimitiveGovernanceInput
): PrimitiveGovernanceResult {
  assertGovernedComponentName(input.componentName);

  const definition = getPrimitiveDefinition(input.componentName);
  const recipeName = input.recipeName ?? definition.recipeName;
  const state = resolveGovernedState(input.state, definition.defaultState);
  const slot = resolveSlotRole(input.slot, definition.defaultSlot);

  assertPrimitiveSlotAllowed(definition, slot);

  const recipeClassName = resolveRecipeClassName(input, definition);
  const slotClassName = resolveSlotClassName(input, definition, slot);
  const layoutClassName = resolveLayoutClassName(input.className);
  const accessibility = getComponentAccessibilityRequirement(input.componentName);
  const motion = resolvePrimitiveMotion(input, definition);

  return {
    recipeName,
    className: cn(recipeClassName, slotClassName, layoutClassName),
    state,
    slot,
    motion,
    accessibility,
    dataAttributes: buildDataAttributes(
      input,
      definition,
      recipeName,
      state,
      slot
    ),
  };
}

export type { FieldOrientation, PrimitiveGovernanceInput, PrimitiveGovernanceResult };
