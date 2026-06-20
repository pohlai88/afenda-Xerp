import {
  ACCESSIBILITY_REQUIREMENTS,
  type AccessibilityContract,
  type AccessibilityRequirement,
} from "./design-system";

const isDevelopment = process.env["NODE_ENV"] !== "production";

export type GovernedUiComponentName = "Button" | "Badge" | "Card";
type GovernedRecipeName = "button" | "badge" | "card";

export interface ComponentAccessibilityDefinition {
  readonly componentName: GovernedUiComponentName;
  readonly recipeName: GovernedRecipeName;
  readonly requirements: readonly AccessibilityRequirement[];
  readonly rationale: string;
}

const accessibilityPolicy = Object.freeze({
  baseline: ACCESSIBILITY_REQUIREMENTS,
  minTouchTarget: "44px",
  focusRingToken: "color.focus.ring",
  statusMustUseAriaLive: true,
} as const satisfies AccessibilityContract);

const componentAccessibilityRegistry = Object.freeze({
  Button: Object.freeze({
    componentName: "Button",
    recipeName: "button",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Button must remain semantic, keyboard reachable, focus visible, programmatically named, state-safe, color-safe, and reduced-motion safe.",
  }),
  Badge: Object.freeze({
    componentName: "Badge",
    recipeName: "badge",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Badge must not rely on color alone and must preserve programmatic meaning for status-like presentation.",
  }),
  Card: Object.freeze({
    componentName: "Card",
    recipeName: "card",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Card must preserve semantic structure and must not bypass focus, state, color, or reduced-motion safety when interactive.",
  }),
} as const satisfies Record<
  GovernedUiComponentName,
  ComponentAccessibilityDefinition
>);

function isGovernedUiComponentName(
  componentName: string
): componentName is GovernedUiComponentName {
  return componentName in componentAccessibilityRegistry;
}

export function getComponentAccessibilityRequirement(
  componentName: GovernedUiComponentName
): readonly AccessibilityRequirement[];

export function getComponentAccessibilityRequirement(
  componentName: string
): readonly AccessibilityRequirement[];

export function getComponentAccessibilityRequirement(
  componentName: string
): readonly AccessibilityRequirement[] {
  if (!isGovernedUiComponentName(componentName)) {
    if (isDevelopment) {
      throw new Error(
        `TIP-004 accessibility policy violation. Unknown governed component "${componentName}". Register the component accessibility definition before consuming it.`
      );
    }

    return accessibilityPolicy.baseline;
  }

  return componentAccessibilityRegistry[componentName].requirements;
}

export function getComponentAccessibilityDefinition(
  componentName: GovernedUiComponentName
): ComponentAccessibilityDefinition {
  return componentAccessibilityRegistry[componentName];
}

export function getAccessibilityPolicy(): AccessibilityContract {
  return accessibilityPolicy;
}
