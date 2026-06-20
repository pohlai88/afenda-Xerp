import type { SlotContract } from "./slot.contract";
import type { TokenName } from "./token.contract";
import type { VariantAxis } from "./variant.contract";

export const recipeContract = {
  acceptanceRules: [
    "Every recipe declaration must consume approved token names",
    "Every recipe variant hook must reference approved variant axes",
    "Recipes must compose styling only and must not declare behavior",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent component behavior",
      "Use raw CSS values instead of tokens",
      "Create unapproved variant axes or slot names",
    ],
    allowed: [
      "Compose styles from approved tokens",
      "Reference approved slots and variants",
      "Declare prohibited overrides for consumer safety",
    ],
  },
  allowedResponsibility: [
    "Compose styling from tokens",
    "Bind styling to approved variants",
    "Bind styling to approved slots",
  ],
  contractId: "afenda.design-system.recipe",
  downstreamConsumers: [
    "component.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "styling composition",
  owner: "TIP-004 recipe contract",
  prohibitedResponsibility: [
    "Define component behavior",
    "Define raw design values",
    "Define visual meaning",
    "Define business logic",
    "Define accessibility semantics",
  ],
  purpose:
    "Own styling composition by joining approved tokens, variants, and slots.",
  version: "0.1.0",
} as const;

export interface RecipeDeclaration {
  readonly property:
    | "background"
    | "border"
    | "foreground"
    | "focusRing"
    | "gap"
    | "height"
    | "padding"
    | "radius"
    | "shadow"
    | "transition"
    | "typography";
  readonly token: TokenName;
}

export interface RecipeDefinition {
  readonly componentKind:
    | "button"
    | "badge"
    | "card"
    | "table"
    | "form"
    | "status";
  readonly declarations: readonly RecipeDeclaration[];
  readonly description: string;
  readonly name: string;
  readonly prohibitedOverrides: readonly string[];
  readonly slots: readonly SlotContract[];
  readonly variantAxes: readonly VariantAxis[];
}

export interface RecipeRegistry {
  readonly recipes: readonly RecipeDefinition[];
}
