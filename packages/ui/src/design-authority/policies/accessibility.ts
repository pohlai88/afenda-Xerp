import {
  ACCESSIBILITY_REQUIREMENTS,
  type AccessibilityContract,
} from "../contracts/accessibility.contract";

export const accessibilityPolicy = {
  baseline: ACCESSIBILITY_REQUIREMENTS,
  focusRingToken: "afenda.color.focus.ring",
  minTouchTarget: "44px",
  statusMustUseAriaLive: true,
} as const satisfies AccessibilityContract;
