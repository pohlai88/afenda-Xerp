import { cn } from "../lib/utils";

import { getComponentAccessibilityRequirement } from "./accessibility";
import {
  assertAllowedLayoutClassName,
  resolveLayoutClassName,
} from "./class-name";
import { guardClassName } from "./class-name-guard";
import { isGovernedCardLayoutSize } from "./component-props";
import type { MotionContract, SlotRole } from "./design-system";
import { enforceGovernance, enforceGovernanceOr } from "./dev-env";
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
  resolveToggleClassName,
} from "./recipe";
import { resolveSlotRole } from "./slot";
import { resolveGovernedState } from "./state";
import type { GovernedUiComponentName } from "./types";

function assertGovernedComponentName(
  componentName: string
): asserts componentName is GovernedUiComponentName {
  if (!isGovernedPrimitive(componentName)) {
    enforceGovernance(
      `TIP-004B primitive governance violation. Unknown governed component "${componentName}". Register it in GOVERNED_PRIMITIVE_REGISTRY before calling resolvePrimitiveGovernance().`
    );
  }
}

function assertPrimitiveSlotAllowed(
  definition: GovernedPrimitiveDefinition,
  slot: SlotRole
): void {
  if (!definition.slots.includes(slot)) {
    enforceGovernance(
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

  if (
    (input.componentName === "Card" || input.componentName === "Alert") &&
    input.slot !== undefined &&
    input.slot !== "root" &&
    input.variant === undefined &&
    input.fieldOrientation === undefined
  ) {
    return "";
  }

  if (
    input.componentName === "Field" &&
    input.variant === undefined &&
    input.fieldOrientation === undefined &&
    (input.slot !== "root" || input.slotKey !== undefined)
  ) {
    return "";
  }

  if (
    input.componentName === "Table" &&
    input.variant === undefined &&
    (input.slot !== "root" || input.slotKey !== undefined)
  ) {
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
      return enforceGovernanceOr(
        `TIP-004B primitive slot key violation. Component "${definition.componentName}" does not define slotKey "${input.slotKey}".`,
        definition.slotClassNames[slot] ?? ""
      );
    }

    const baseClassName =
      input.slot === undefined ? "" : (definition.slotClassNames[slot] ?? "");

    return cn(baseClassName, slotClassName);
  }

  const baseClassName = definition.slotClassNames[slot] ?? "";
  const size = input.variant?.size;

  if (definition.controlPresentation === "leaf" && size !== undefined) {
    if (definition.componentName === "Switch") {
      const switchSizeKey = size === "sm" ? "size-sm" : "size-md";
      return cn(baseClassName, definition.slotClassNamesByKey?.[switchSizeKey]);
    }

    if (definition.componentName === "Select" && slot === "control") {
      const triggerSizeKey =
        size === "sm" ? "trigger-size-sm" : "trigger-size-md";
      return cn(
        baseClassName,
        definition.slotClassNamesByKey?.[triggerSizeKey]
      );
    }

    const leafSizeClassName = definition.slotClassNamesByKey?.[size];
    return cn(baseClassName, leafSizeClassName);
  }

  if (
    (definition.componentName === "Toggle" && slot === "root") ||
    (definition.componentName === "ToggleGroup" && slot === "control")
  ) {
    return cn(
      baseClassName,
      resolveToggleClassName({
        variant: input.toggleVariant ?? "default",
        size: input.toggleSize ?? "default",
      })
    );
  }

  if (definition.componentName === "Empty" && slot === "icon") {
    const mediaVariant = input.emptyMediaVariant ?? "default";
    const mediaClassName =
      definition.slotClassNamesByKey?.[
        mediaVariant === "icon" ? "media-icon" : "media-default"
      ];

    return cn(baseClassName, mediaClassName);
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
      return enforceGovernanceOr(
        `TIP-004B primitive slot key violation. Component "${definition.componentName}" does not define slotKey "${input.slotKey}".`,
        definition.componentName.toLowerCase()
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
  const attributes: Record<string, string> = {
    "data-component": input.componentName,
    "data-recipe": recipeName,
    "data-state": state,
    "data-slot": resolveDataSlot(input, definition, slot),
  };

  if (
    input.componentName === "Card" &&
    slot === "root" &&
    input.layoutSize !== undefined
  ) {
    attributes["data-size"] = input.layoutSize;
  }

  return attributes;
}

function assertCardLayoutSize(input: PrimitiveGovernanceInput): void {
  if (input.layoutSize === undefined) {
    return;
  }

  if (input.componentName !== "Card") {
    return;
  }

  if (!isGovernedCardLayoutSize(input.layoutSize)) {
    enforceGovernance(
      `TIP-004B card layout size violation. Unsupported layout size "${input.layoutSize}". Allowed: default, sm.`
    );
  }
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
  assertCardLayoutSize(input);

  const recipeClassName = resolveRecipeClassName(input, definition);
  const slotClassName = resolveSlotClassName(input, definition, slot);
  const classNamePolicy = guardClassName(input.className);
  assertAllowedLayoutClassName(input.className);
  const layoutClassName = resolveLayoutClassName(input.className);
  const selection = input.variant ?? {};
  const accessibility = getComponentAccessibilityRequirement(
    input.componentName
  );
  const motion = resolvePrimitiveMotion(input, definition);

  return {
    recipeName,
    recipe: recipeName,
    selection,
    violations: classNamePolicy.violations,
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

export type {
  FieldOrientation,
  PrimitiveGovernanceInput,
  PrimitiveGovernanceResult,
};
