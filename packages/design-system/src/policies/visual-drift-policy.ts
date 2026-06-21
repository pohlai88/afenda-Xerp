import { AI_GENERATION_RULES } from "./ai-generation-policy";
import { classNamePolicy } from "./class-name-policy";

/**
 * Visual drift policy — enterprise anti-slop rules for AI and human authors.
 */
export const visualDriftPolicy = {
  owner: "@afenda/design-system",
  prohibitedVisualSlop: [
    "Purple/cyan SaaS gradient backgrounds",
    "Glassmorphism (backdrop-blur + neon borders)",
    "Emoji used as UI icons",
    "Bounce or elastic easing curves",
    "Uniform border-radius on every element",
    "Colored pills on trend percentages in dashboards",
    "Thick colored left borders on metric cards",
    "Decorative glow shadows as primary affordance",
    "Marketing-page hero gradients in ERP surfaces",
  ],
  allowedPatterns: classNamePolicy.allowedLayoutPatterns,
  prohibitedPatterns: classNamePolicy.prohibitedPatterns,
  aiGenerationRules: AI_GENERATION_RULES,
  enforcement: [
    "Recipes must reference afenda.* tokens only",
    "className limited to layout utilities",
    "Status must not rely on color alone — pair with text/icons",
    "Motion respects prefers-reduced-motion",
  ],
} as const;

export type VisualDriftPolicy = typeof visualDriftPolicy;
