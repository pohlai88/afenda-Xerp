/**
 * Validation layer for @afenda/design-system.
 *
 * Each validator returns a `ValidationResult[]`. Use them in governance
 * scripts and tests to enforce design-system boundary rules at runtime.
 */

export interface ValidationResult {
  /** Present when `passed` is false. */
  readonly detail: string | undefined;
  readonly passed: boolean;
  readonly rule: string;
}

export { validateClassNames } from "./class-name.validation";
export { validateExportSurface } from "./export.validation";
export { validateMotionRegistry } from "./motion.validation";
export { validateRecipeRegistry } from "./recipe.validation";
export { validateStateRegistry } from "./state.validation";
export { validateTokenRegistry } from "./token.validation";
export { validateVariantRegistry } from "./variant.validation";
