import {
  ACCESSIBILITY_REQUIREMENTS,
  type AccessibilityContract,
  type AccessibilityRequirement,
  accessibilityPolicy,
} from "./design-system";
import { reportGovernanceRuntimeViolation } from "./dev-env";
import {
  type GovernedUiComponentName,
  isGovernedUiComponentName,
} from "./types";

export interface ComponentAccessibilityDefinition {
  readonly componentName: GovernedUiComponentName;
  readonly rationale: string;
  readonly requirements: readonly AccessibilityRequirement[];
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
  Dialog: Object.freeze({
    componentName: "Dialog",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Dialog must preserve focus trap semantics, titling, and modal overlay accessibility without local styling authority.",
  }),
  Popover: Object.freeze({
    componentName: "Popover",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Popover must preserve trigger/content association and keyboard dismissal without inventing local presentation.",
  }),
  Tooltip: Object.freeze({
    componentName: "Tooltip",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Tooltip must expose supplementary text programmatically and remain readable without color-only meaning.",
  }),
  Tabs: Object.freeze({
    componentName: "Tabs",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Tabs must preserve tablist semantics, selection state, and keyboard navigation without local styling authority.",
  }),
  Select: Object.freeze({
    componentName: "Select",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Select must preserve listbox semantics, value labeling, and keyboard traversal without inventing local styling.",
  }),
  DropdownMenu: Object.freeze({
    componentName: "DropdownMenu",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "DropdownMenu must preserve menu semantics, item selection, and keyboard traversal without local styling authority.",
  }),
  ContextMenu: Object.freeze({
    componentName: "ContextMenu",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "ContextMenu must preserve menu semantics, item selection, and keyboard traversal without local styling authority.",
  }),
  Menubar: Object.freeze({
    componentName: "Menubar",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Menubar must preserve menu bar semantics, item selection, and keyboard traversal without local styling authority.",
  }),
  Breadcrumb: Object.freeze({
    componentName: "Breadcrumb",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Breadcrumb must preserve landmark navigation semantics and current-page indication without local styling authority.",
  }),
  Pagination: Object.freeze({
    componentName: "Pagination",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Pagination must preserve navigation semantics and current-page indication without local styling authority.",
  }),
  NavigationMenu: Object.freeze({
    componentName: "NavigationMenu",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "NavigationMenu must preserve navigation semantics, focus management, and keyboard traversal without local styling authority.",
  }),
  ButtonGroup: Object.freeze({
    componentName: "ButtonGroup",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "ButtonGroup must preserve grouped control semantics and focus visibility without local styling authority.",
  }),
  Item: Object.freeze({
    componentName: "Item",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Item must preserve list row semantics and readable density without inventing local styling authority.",
  }),
  Sheet: Object.freeze({
    componentName: "Sheet",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Sheet must preserve modal focus semantics, titling, and edge-panel presentation without local styling authority.",
  }),
  Drawer: Object.freeze({
    componentName: "Drawer",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Drawer must preserve mobile-friendly overlay semantics and titling without inventing local presentation.",
  }),
  RadioGroup: Object.freeze({
    componentName: "RadioGroup",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "RadioGroup must expose single-selection state programmatically and remain keyboard operable with visible focus.",
  }),
  Separator: Object.freeze({
    componentName: "Separator",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Separator must preserve orientation semantics and decorative role without inventing local styling authority.",
  }),
  Skeleton: Object.freeze({
    componentName: "Skeleton",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Skeleton must remain presentational-only and must not bypass reduced-motion or color-safe loading affordances.",
  }),
  ScrollArea: Object.freeze({
    componentName: "ScrollArea",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "ScrollArea must preserve scrollable region semantics and keyboard focus visibility without local styling authority.",
  }),
  Avatar: Object.freeze({
    componentName: "Avatar",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Avatar must preserve image fallback semantics and readable initials without relying on color alone.",
  }),
  AlertDialog: Object.freeze({
    componentName: "AlertDialog",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "AlertDialog must preserve modal alert semantics, titling, and action focus order without local styling authority.",
  }),
  Form: Object.freeze({
    componentName: "Form",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Form aliases must preserve Field accessibility contracts and programmatic label-control wiring.",
  }),
  DataTable: Object.freeze({
    componentName: "DataTable",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "DataTable must preserve semantic table structure and readable empty states without inventing local styling.",
  }),
  Toaster: Object.freeze({
    componentName: "Toaster",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Toaster must expose toast announcements safely and remain readable without color-only meaning.",
  }),
  Progress: Object.freeze({
    componentName: "Progress",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Progress must expose value semantics programmatically and remain readable without color-only meaning.",
  }),
  Toggle: Object.freeze({
    componentName: "Toggle",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Toggle must expose pressed state programmatically and remain keyboard operable with visible focus.",
  }),
  ToggleGroup: Object.freeze({
    componentName: "ToggleGroup",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "ToggleGroup must preserve single- or multi-selection semantics and keyboard traversal without local styling authority.",
  }),
  Slider: Object.freeze({
    componentName: "Slider",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Slider must expose value semantics programmatically and remain keyboard operable with visible focus.",
  }),
  Accordion: Object.freeze({
    componentName: "Accordion",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Accordion must preserve expandable section semantics and keyboard operability without local styling authority.",
  }),
  HoverCard: Object.freeze({
    componentName: "HoverCard",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "HoverCard must preserve trigger/content association and readable supplementary content without local styling authority.",
  }),
  Kbd: Object.freeze({
    componentName: "Kbd",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Kbd must remain presentational-only and readable without relying on color alone.",
  }),
  Spinner: Object.freeze({
    componentName: "Spinner",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Spinner must expose loading status programmatically and respect reduced-motion preferences.",
  }),
  StatusIndicator: Object.freeze({
    componentName: "StatusIndicator",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "StatusIndicator must communicate status with dot-plus-text semantics without color-only meaning or filled background pills.",
  }),
  Empty: Object.freeze({
    componentName: "Empty",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Empty must preserve readable empty-state structure without inventing local styling authority.",
  }),
  Collapsible: Object.freeze({
    componentName: "Collapsible",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Collapsible must preserve expandable section semantics and keyboard operability without local styling authority.",
  }),
  AspectRatio: Object.freeze({
    componentName: "AspectRatio",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "AspectRatio must preserve media sizing semantics without inventing local styling authority.",
  }),
  Direction: Object.freeze({
    componentName: "Direction",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Direction must preserve text direction context for nested interactive primitives without local styling authority.",
  }),
  InputGroup: Object.freeze({
    componentName: "InputGroup",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "InputGroup must preserve grouped control semantics and label association without local styling authority.",
  }),
  InputOTP: Object.freeze({
    componentName: "InputOTP",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "InputOTP must preserve one-time code entry semantics and keyboard operability without local styling authority.",
  }),
  NativeSelect: Object.freeze({
    componentName: "NativeSelect",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "NativeSelect must preserve native listbox semantics and keyboard traversal without local styling authority.",
  }),
  Command: Object.freeze({
    componentName: "Command",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Command must preserve combobox semantics, item selection, and keyboard traversal without local styling authority.",
  }),
  Combobox: Object.freeze({
    componentName: "Combobox",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Combobox must preserve combobox semantics, value labeling, and keyboard traversal without local styling authority.",
  }),
  Carousel: Object.freeze({
    componentName: "Carousel",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Carousel must preserve slide navigation semantics and keyboard operability without local styling authority.",
  }),
  Calendar: Object.freeze({
    componentName: "Calendar",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Calendar must preserve date grid semantics, selection state, and keyboard traversal without local styling authority.",
  }),
  Chart: Object.freeze({
    componentName: "Chart",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Chart must communicate data without color-only meaning and remain readable with assistive technology.",
  }),
  Resizable: Object.freeze({
    componentName: "Resizable",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Resizable must preserve panel resize semantics and keyboard-safe separators without local styling authority.",
  }),
  Sidebar: Object.freeze({
    componentName: "Sidebar",
    requirements: ACCESSIBILITY_REQUIREMENTS,
    rationale:
      "Sidebar must preserve navigation landmark semantics and keyboard traversal without local styling authority.",
  }),
} as const satisfies Record<
  GovernedUiComponentName,
  ComponentAccessibilityDefinition
>);

function formatUnknownComponentViolation(componentName: string): string {
  return `Foundation phase 04 accessibility policy violation. Unknown governed component "${componentName}". Register the component accessibility definition before consuming it.`;
}

export function getComponentAccessibilityRequirement(
  componentName: string | GovernedUiComponentName
): readonly AccessibilityRequirement[];

export function getComponentAccessibilityRequirement(
  componentName: string
): readonly AccessibilityRequirement[] {
  if (!isGovernedUiComponentName(componentName)) {
    reportGovernanceRuntimeViolation(
      formatUnknownComponentViolation(componentName)
    );

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
