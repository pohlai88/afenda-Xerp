import {
  ACCESSIBILITY_REQUIREMENTS,
  accessibilityPolicy,
  type AccessibilityContract,
  type AccessibilityRequirement,
} from "./design-system";
import { isDevelopment } from "./dev-env";
import {
  isGovernedUiComponentName,
  type GovernedUiComponentName,
} from "./types";

export interface ComponentAccessibilityDefinition {
  readonly componentName: GovernedUiComponentName;
  readonly requirements: readonly AccessibilityRequirement[];
  readonly rationale: string;
}

const componentAccessibilityRegistry = Object.freeze({
  Button: Object.freeze({
    componentName: "Button",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Button must remain semantic, keyboard reachable, focus visible, programmatically named, state-safe, color-safe, and reduced-motion safe.",
  }),
  Badge: Object.freeze({
    componentName: "Badge",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Badge must not rely on color alone and must preserve programmatic meaning for status-like presentation.",
  }),
  Card: Object.freeze({
    componentName: "Card",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Card must preserve semantic structure and must not bypass focus, state, color, or reduced-motion safety when interactive.",
  }),
  Alert: Object.freeze({
    componentName: "Alert",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Alert must expose status semantics, preserve live-region safety, and communicate tone without color-only meaning.",
  }),
  Field: Object.freeze({
    componentName: "Field",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Field groups must wire labels, controls, descriptions, and validation states with programmatic associations.",
  }),
  Table: Object.freeze({
    componentName: "Table",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Table presentation must preserve semantic table structure and readable density without inventing local styling authority.",
  }),
  Input: Object.freeze({
    componentName: "Input",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Input must preserve label association, validation state exposure, focus visibility, and color-safe error presentation.",
  }),
  Label: Object.freeze({
    componentName: "Label",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Label must remain programmatically associated with controls and readable without relying on color alone.",
  }),
  Textarea: Object.freeze({
    componentName: "Textarea",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Textarea must preserve multiline editing semantics, validation state exposure, and focus-visible safety.",
  }),
  Checkbox: Object.freeze({
    componentName: "Checkbox",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Checkbox must expose checked state programmatically and remain keyboard operable with visible focus.",
  }),
  Switch: Object.freeze({
    componentName: "Switch",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Switch must expose on/off state programmatically, preserve focus visibility, and avoid color-only meaning.",
  }),
} as const satisfies Record<
  GovernedUiComponentName,
  ComponentAccessibilityDefinition
>);

function formatUnknownComponentViolation(componentName: string): string {
  return `TIP-004 accessibility policy violation. Unknown governed component "${componentName}". Register the component accessibility definition before consuming it.`;
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
      throw new Error(formatUnknownComponentViolation(componentName));
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

export function getRecipeAccessibilityDefinitions(): readonly ComponentAccessibilityDefinition[] {
  return Object.values(componentAccessibilityRegistry);
}

export function hasComponentAccessibilityDefinition(
  componentName: string
): componentName is GovernedUiComponentName {
  return isGovernedUiComponentName(componentName);
}
