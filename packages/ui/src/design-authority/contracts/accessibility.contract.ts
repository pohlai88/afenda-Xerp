export const ACCESSIBILITY_REQUIREMENTS = [
  "semanticElement",
  "keyboardReachable",
  "visibleFocus",
  "programmaticName",
  "stateAnnounced",
  "colorNotOnlySignal",
  "reducedMotionSafe",
] as const;

export const accessibilityContract = {
  acceptanceRules: [
    "Every component must satisfy the baseline accessibility requirements",
    "Every status surface must announce state through approved aria-live behavior",
    "Accessibility rules must govern interaction safety without owning permission logic",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent accessibility exceptions",
      "Use color as the only state signal",
      "Replace permission logic with accessibility logic",
    ],
    allowed: [
      "Apply baseline accessibility requirements",
      "Use approved focus and touch target rules",
      "Require accessible alternatives for state and motion",
    ],
  },
  allowedResponsibility: [
    "Define interaction safety",
    "Define semantic and keyboard obligations",
    "Define focus, announcement, and reduced-motion requirements",
  ],
  contractId: "afenda.design-system.accessibility",
  downstreamConsumers: [
    "component.contract.ts",
    "state.contract.ts",
    "motion.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "interaction safety",
  owner: "Governed UI accessibility contract",
  prohibitedResponsibility: [
    "Define domain permissions",
    "Define domain business rules",
    "Define visual tokens",
    "Define styling recipes",
  ],
  purpose:
    "Own interaction safety requirements for governed Afenda UI surfaces.",
  version: "0.2.0",
} as const;

export type AccessibilityRequirement =
  (typeof ACCESSIBILITY_REQUIREMENTS)[number];

export interface AccessibilityContract {
  readonly baseline: readonly AccessibilityRequirement[];
  /** Afenda-prefixed token name for focus ring color. */
  readonly focusRingToken: "afenda.color.focus.ring";
  /** Minimum touch target size (44px per WCAG 2.5.5). */
  readonly minTouchTarget: "44px";
  readonly statusMustUseAriaLive: boolean;
}
