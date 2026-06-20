import type { AccessibilityRequirement } from "./accessibility.contract";
import type { SlotContract } from "./slot.contract";
import type { GovernedState } from "./state.contract";

export const componentContract = {
  acceptanceRules: [
    "Every component must consume approved tokens, variants, recipes, slots, states, motion, and accessibility rules",
    "Components must wire behavior and accessibility without inventing visual authority",
    "Components must not include domain business rules",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent tokens, variants, recipes, slots, states, motion rules, or accessibility rules",
      "Define local design primitives",
      "Embed domain business workflows or permissions",
    ],
    allowed: [
      "Wire behavior to approved design-system contracts",
      "Consume recipe, slot, state, motion, and accessibility contracts",
      "Expose component behavior that stays inside the design-system boundary",
    ],
  },
  allowedResponsibility: [
    "Define UI behavior",
    "Wire accessibility obligations",
    "Consume approved design-system contracts",
  ],
  contractId: "afenda.design-system.component",
  downstreamConsumers: ["@afenda/ui", "AppShell", "Metadata UI", "examples"],
  ownedResponsibility: "behavior",
  owner: "TIP-004 component contract",
  prohibitedResponsibility: [
    "Invent tokens",
    "Invent variants",
    "Invent recipes",
    "Invent slots",
    "Invent business logic",
    "Define database schema",
  ],
  purpose:
    "Own component behavior while consuming all visual authority from other design-system contracts.",
  version: "0.1.0",
} as const;

export interface GovernedComponentContract {
  readonly accessibility: readonly AccessibilityRequirement[];
  readonly classNamePolicy: "layout-only";
  readonly forbidsBusinessLogic: true;
  readonly name: string;
  readonly packageBoundary: "@afenda/ui" | "@afenda/design-system";
  readonly recipe: string;
  readonly slots: readonly SlotContract[];
  readonly supportedStates: readonly GovernedState[];
}
