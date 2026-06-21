import { cssVariablePolicy } from "./css-variable-policy";
import { tokenNamePolicy } from "./token-name-policy";

/**
 * Design token policy — single authority for token naming, CSS variables, and usage.
 */
export const designTokenPolicy = {
  owner: "@afenda/design-system",
  prefix: tokenNamePolicy.prefix,
  cssVariablePrefix: cssVariablePolicy.prefix,
  format: tokenNamePolicy.format,
  cssVariableFormat: cssVariablePolicy.format,
  layers: {
    raw: "Literal OKLCH/rem/px values with optional darkValue overrides.",
    semantic: "var(--afenda-*) aliases only — no darkValue, no literals.",
    component: "Recipe declarations binding semantics to component properties.",
  },
  allowed: [
    "Register new tokens in token.registry.ts only",
    "Consume semantic tokens in recipes and downstream packages",
    "Use tokenNameToCssVariable() for CSS variable derivation",
    "Use data-afenda-density hooks for density modes",
  ],
  forbidden: [
    "Raw hex, hsl, or oklch literals in recipes or downstream UI",
    "Unprefixed CSS variables (--color-*, --spacing-*) outside the shadcn bridge",
    "Component-local design tokens in apps or metadata-ui",
    "Duplicate token names or parallel registries",
  ],
  rules: [...tokenNamePolicy.rules, ...cssVariablePolicy.rules],
} as const;

export type DesignTokenPolicy = typeof designTokenPolicy;
