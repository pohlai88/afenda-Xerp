import type { AccessibilityContract } from "./accessibility.contract";
import type { ClassNamePolicyContract } from "./class-name-policy.contract";
import type { GovernedExample } from "./example.contract";
import type { PublicExportContract } from "./export.contract";
import type { MotionContract } from "./motion.contract";
import type { RecipeRegistry } from "./recipe.contract";
import type { StateContract } from "./state.contract";
import type { TokenRegistry } from "./token.contract";
import type { VariantRegistry } from "./variant.contract";

export interface DesignSystemContract {
  readonly accessibility: AccessibilityContract;
  readonly classNamePolicy: ClassNamePolicyContract;
  readonly examples: readonly GovernedExample[];
  readonly exports: PublicExportContract;
  readonly motion: readonly MotionContract[];
  readonly packageName: "@afenda/ui/design-authority";
  readonly principle: {
    readonly tokenOwnsValue: true;
    readonly variantOwnsMeaning: true;
    readonly recipeOwnsStyling: true;
    readonly componentOwnsBehavior: true;
    readonly slotOwnsStructure: true;
    readonly classNameOwnsLayoutOnly: true;
    readonly exampleOwnsAiImitation: true;
  };
  readonly recipes: RecipeRegistry;
  readonly states: StateContract;
  readonly tokens: TokenRegistry;
  readonly variants: VariantRegistry;
}
