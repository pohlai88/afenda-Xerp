import {
  DENSITIES,
  RADII,
  SHADOWS,
  SIZES,
  STATUS_TONES,
  TOKEN_CATEGORIES,
} from "../contracts/token.contract";
import {
  VARIANT_AXES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
} from "../contracts/variant.contract";
import { AFENDA_VARIANT_REGISTRY } from "../registries/variant.registry";
import type { ValidationResult } from "./index";

export function validateVariantRegistry(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const governedAxes = new Set<string>(VARIANT_AXES);
  const governedCategories = new Set<string>(TOKEN_CATEGORIES);
  const governedOptions = new Set<string>([
    ...VARIANT_INTENTS,
    ...VARIANT_EMPHASES,
    ...STATUS_TONES,
    ...DENSITIES,
    ...SIZES,
    ...RADII,
    ...SHADOWS,
  ]);

  for (const variant of AFENDA_VARIANT_REGISTRY.variants) {
    const validAxis = governedAxes.has(variant.axis);
    results.push({
      rule: `variant.axis.governed: ${variant.axis}`,
      passed: validAxis,
      detail: validAxis
        ? undefined
        : `Variant axis "${variant.axis}" is not governed`,
    });

    const validOption = governedOptions.has(variant.option);
    results.push({
      rule: `variant.option.governed: ${variant.axis}=${variant.option}`,
      passed: validOption,
      detail: validOption
        ? undefined
        : `Variant option "${variant.option}" on axis "${variant.axis}" is not governed`,
    });

    for (const category of variant.allowedTokenCategories) {
      const validCat = governedCategories.has(category);
      results.push({
        rule: `variant.tokenCategory.governed: ${variant.axis}=${variant.option} uses ${category}`,
        passed: validCat,
        detail: validCat
          ? undefined
          : `Token category "${category}" in variant "${variant.axis}=${variant.option}" is not governed`,
      });
    }
  }

  return results;
}
