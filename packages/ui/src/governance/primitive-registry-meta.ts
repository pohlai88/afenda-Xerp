import { PROHIBITED_CLASSNAME_PATTERNS } from "./design-system";
import {
  GOVERNED_PRIMITIVE_REGISTRY,
  getPrimitiveDefinition,
} from "./primitive-registry";
import type { GovernedRecipeName, GovernedUiComponentName } from "./types";

/** Core primitives required for AppShell / Metadata UI consumption. */
export const CORE_PRIMITIVE_NAMES = [
  "Button",
  "Badge",
  "Card",
  "Alert",
  "Field",
  "Table",
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "Dialog",
  "DropdownMenu",
  "Tabs",
  "Separator",
  "Skeleton",
] as const satisfies readonly GovernedUiComponentName[];

export type CorePrimitiveName = (typeof CORE_PRIMITIVE_NAMES)[number];

export interface PrimitiveRegistryEntry {
  readonly accessibility: {
    readonly keyboard: boolean;
    readonly focusVisible: boolean;
    readonly aria: boolean;
  };
  readonly allowedClassNamePassthrough: readonly string[];
  readonly component: GovernedUiComponentName;
  readonly lifecycle: "active" | "experimental" | "deprecated";
  readonly ownerPackage: "@afenda/ui";
  readonly prohibitedClassNamePatterns: readonly string[];
  readonly recipe: GovernedRecipeName;
}

const STRUCTURAL_PASSTHROUGH = [
  "w-full",
  "min-w-0",
  "max-w-full",
  "flex",
  "inline-flex",
  "grid",
  "hidden",
  "sr-only",
  "truncate",
  "overflow-hidden",
  "overflow-auto",
] as const;

function buildEntry(
  component: CorePrimitiveName,
  lifecycle: PrimitiveRegistryEntry["lifecycle"] = "active"
): PrimitiveRegistryEntry {
  const definition = getPrimitiveDefinition(component);

  return {
    component,
    recipe: definition.recipeName,
    ownerPackage: "@afenda/ui",
    lifecycle,
    accessibility: {
      keyboard: component !== "Separator" && component !== "Skeleton",
      focusVisible: true,
      aria: true,
    },
    allowedClassNamePassthrough: STRUCTURAL_PASSTHROUGH,
    prohibitedClassNamePatterns: PROHIBITED_CLASSNAME_PATTERNS,
  };
}

/** Registry metadata for core governed primitives — aligns with design-system recipes. */
export const PRIMITIVE_REGISTRY_ENTRIES: Record<
  CorePrimitiveName,
  PrimitiveRegistryEntry
> = {
  Button: buildEntry("Button"),
  Badge: buildEntry("Badge"),
  Card: buildEntry("Card"),
  Alert: buildEntry("Alert"),
  Field: buildEntry("Field"),
  Table: buildEntry("Table"),
  Input: buildEntry("Input"),
  Textarea: buildEntry("Textarea"),
  Select: buildEntry("Select"),
  Checkbox: buildEntry("Checkbox"),
  Dialog: buildEntry("Dialog"),
  DropdownMenu: buildEntry("DropdownMenu"),
  Tabs: buildEntry("Tabs"),
  Separator: buildEntry("Separator"),
  Skeleton: buildEntry("Skeleton"),
};

export function getPrimitiveRegistryEntry(
  component: CorePrimitiveName
): PrimitiveRegistryEntry {
  return PRIMITIVE_REGISTRY_ENTRIES[component];
}

export function listRegisteredPrimitiveNames(): readonly GovernedUiComponentName[] {
  return Object.keys(GOVERNED_PRIMITIVE_REGISTRY) as GovernedUiComponentName[];
}
