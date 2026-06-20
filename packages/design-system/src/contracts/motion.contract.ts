export const MOTION_INTENTS = [
  "instant",
  "feedback",
  "navigation",
  "overlay",
] as const;

export const motionContract = {
  acceptanceRules: [
    "Every movement must use an approved motion intent",
    "Every motion pattern must specify duration, easing, and reduced-motion behavior",
    "Motion must enhance interaction safety and must not create component APIs",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent animation durations, easing, or intent names",
      "Use motion to communicate state without accessible alternatives",
      "Create unsafe movement that ignores reduced-motion behavior",
    ],
    allowed: [
      "Select approved motion intents",
      "Reference approved motion tokens",
      "Apply reduced-motion behavior from this contract",
    ],
  },
  allowedResponsibility: [
    "Define movement safety",
    "Define motion intent vocabulary",
    "Define reduced-motion obligations",
  ],
  contractId: "afenda.design-system.motion",
  downstreamConsumers: [
    "recipe.contract.ts",
    "component.contract.ts",
    "accessibility.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "movement safety",
  owner: "TIP-004 motion contract",
  prohibitedResponsibility: [
    "Define component behavior",
    "Define UI state meaning",
    "Define raw CSS animation values outside tokens",
    "Define business logic",
  ],
  purpose:
    "Own safe movement rules and reduced-motion obligations for Afenda UI.",
  version: "0.1.0",
} as const;

export type MotionIntent = (typeof MOTION_INTENTS)[number];

export interface MotionContract {
  readonly durationToken: `motion.duration.${string}`;
  readonly easingToken: `motion.easing.${string}`;
  readonly intent: MotionIntent;
  readonly reducedMotionBehavior: "remove-transform" | "skip-animation";
}
