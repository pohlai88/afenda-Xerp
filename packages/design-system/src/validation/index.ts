/**
 * Validation layer for @afenda/design-system.
 *
 * Each validator returns a `ValidationResult[]`. Use them in governance
 * scripts and tests to enforce design-system boundary rules at runtime.
 */

export interface ValidationResult {
  readonly rule: string;
  readonly passed: boolean;
  /** Present when `passed` is false. */
  readonly detail: string | undefined;
}

export { validateTokenRegistry } from "./token.validation";
export { validateVariantRegistry } from "./variant.validation";
export { validateRecipeRegistry } from "./recipe.validation";
export { validateStateRegistry } from "./state.validation";
export { validateMotionRegistry } from "./motion.validation";
export { validateClassNames } from "./class-name.validation";
export { validateExportSurface } from "./export.validation";
