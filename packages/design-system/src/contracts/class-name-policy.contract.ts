export const PROHIBITED_CLASSNAME_PATTERNS = [
  "bg-",
  "text-",
  "border-",
  "shadow",
  "rounded",
  "ring-",
  "animate-",
  "duration-",
  "ease-",
  "opacity-",
] as const;

export const ALLOWED_LAYOUT_CLASSNAME_PATTERNS = [
  "grid",
  "flex",
  "block",
  "inline",
  "hidden",
  "contents",
  "col-",
  "row-",
  "items-",
  "justify-",
  "self-",
  "place-",
  "order-",
  "w-",
  "h-",
  "min-",
  "max-",
  "overflow-",
] as const;

export const classNamePolicyContract = {
  acceptanceRules: [
    "className may be used only for layout escape",
    "className must not override token, variant, recipe, state, motion, or accessibility meaning",
    "Semantic Tailwind utility policy belongs only in this contract",
  ],
  aiGenerationRules: {
    forbidden: [
      "Use className to set colors, borders, radius, shadow, typography, motion, opacity, or focus meaning",
      "Invent Tailwind utility policy outside this contract",
      "Bypass recipes with semantic class overrides",
    ],
    allowed: [
      "Use className for approved layout utilities only",
      "Validate className against allowed and prohibited patterns",
      "Request recipe or token extension when semantic styling is missing",
    ],
  },
  allowedResponsibility: [
    "Define layout escape policy",
    "Define prohibited semantic class patterns",
    "Define allowed layout class patterns",
  ],
  contractId: "afenda.design-system.class-name-policy",
  downstreamConsumers: [
    "component.contract.ts",
    "recipe.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "layout escape only",
  owner: "TIP-004 class-name policy contract",
  prohibitedResponsibility: [
    "Override design meaning",
    "Define tokens",
    "Define variants",
    "Define recipes",
    "Define page-level styling",
  ],
  purpose:
    "Own the only approved className escape hatch for layout-only composition.",
  version: "0.1.0",
} as const;

export interface ClassNamePolicyContract {
  readonly allowedLayoutPatterns: readonly string[];
  readonly allowedPurpose: "layout-only";
  readonly prohibitedPatterns: readonly string[];
  readonly violationMessage: string;
}
