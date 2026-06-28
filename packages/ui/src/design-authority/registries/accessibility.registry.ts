import {
  ACCESSIBILITY_REQUIREMENTS,
  type AccessibilityRequirement,
} from "../contracts/accessibility.contract";

export const AFENDA_ACCESSIBILITY_REGISTRY = {
  baseline: ACCESSIBILITY_REQUIREMENTS,
  focusRingToken: "afenda.color.focus.ring",
  minTouchTargetToken: "afenda.layout.touch-target.minimum",
  statusMustUseAriaLive: true,
} as const;

export type AfendaAccessibilityRegistry = typeof AFENDA_ACCESSIBILITY_REGISTRY;

/** All governed accessibility baseline requirements. */
export const AFENDA_ACCESSIBILITY_REQUIREMENTS =
  ACCESSIBILITY_REQUIREMENTS satisfies readonly AccessibilityRequirement[];
