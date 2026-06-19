export const ACCESSIBILITY_REQUIREMENTS = [
  "semanticElement",
  "keyboardReachable",
  "visibleFocus",
  "programmaticName",
  "stateAnnounced",
  "colorNotOnlySignal",
  "reducedMotionSafe",
] as const;

export type AccessibilityRequirement =
  (typeof ACCESSIBILITY_REQUIREMENTS)[number];

export interface AccessibilityContract {
  readonly baseline: readonly AccessibilityRequirement[];
  readonly focusRingToken: "color.focus.ring";
  readonly minTouchTarget: "44px";
  readonly statusMustUseAriaLive: boolean;
}
