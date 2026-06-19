import {
  ACCESSIBILITY_REQUIREMENTS,
  type AccessibilityContract,
} from "../contracts/accessibility.contract";

export const accessibilityPolicy = {
  baseline: ACCESSIBILITY_REQUIREMENTS,
  minTouchTarget: "44px",
  focusRingToken: "color.focus.ring",
  statusMustUseAriaLive: true,
} as const satisfies AccessibilityContract;
