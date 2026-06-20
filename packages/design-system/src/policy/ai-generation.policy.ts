/**
 * AI generation rules for the Afenda design system.
 *
 * These rules are the authoritative source for AI IDEs, code generators,
 * and assistant agents operating within the Afenda workspace.
 */

export const AI_GENERATION_RULES = {
  tokenRules: {
    required: [
      "Use only afenda.* token names from @afenda/design-system",
      "Reference tokens by name (e.g. afenda.color.surface.canvas), not by value",
      "Use tokenNameToCssVariable() to derive CSS variables from token names",
      "Add new tokens through the design-system token registry only",
    ],
    forbidden: [
      "Invent token names outside @afenda/design-system",
      "Use unprefixed token names (e.g. color.surface.canvas)",
      "Use --token-* CSS variables (must be --afenda-*)",
      "Hard-code raw HSL, hex, rem, or px values in components or recipes",
      "Infer token names from screenshots, neighboring code, or visual inspection",
    ],
  },
  variantRules: {
    required: [
      "Use only governed variant axes: intent, tone, density, size, radius, shadow, emphasis",
      "Use only governed variant options from @afenda/design-system",
    ],
    forbidden: [
      "Invent new variant axes or options",
      "Attach raw CSS values to variant definitions",
      "Use variants to express business state or domain logic",
    ],
  },
  recipeRules: {
    required: [
      "Compose recipes from governed tokens and variants only",
      "Reference governed slot roles for component structure",
    ],
    forbidden: [
      "Include Tailwind classes in recipe declarations",
      "Include raw CSS values in recipe declarations",
      "Invent component behavior inside recipe declarations",
    ],
  },
  importRules: {
    required: [
      "Import design system contracts only from @afenda/design-system",
      "Use the root entrypoint only — no deep imports",
    ],
    forbidden: [
      "Deep import from @afenda/design-system/tokens, /variants, /recipes, etc.",
      "Duplicate design system authority in app packages",
      "Import React, Radix, or shadcn from @afenda/design-system",
    ],
  },
  classNameRules: {
    required: [
      "Use className for layout utilities only (flex, grid, w-, h-, items-, justify-, overflow-, etc.)",
    ],
    forbidden: [
      "Use className for semantic styling: bg-, text-, border-, shadow-, rounded-, ring-, animate-, duration-, ease-, opacity-",
      "Use arbitrary Tailwind values in className (e.g. w-[14px])",
    ],
  },
} as const;

export type AiGenerationRuleSet = typeof AI_GENERATION_RULES;
