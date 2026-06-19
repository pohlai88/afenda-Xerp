import type { SlotContract } from "./slot.contract";
import type { TokenName } from "./token.contract";
import type { VariantAxis } from "./variant.contract";

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
