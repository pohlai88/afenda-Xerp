import type { VariantSelection } from "./design-system";

/** Serializable governed recipe identifiers aligned with design-system recipe registry. */
export const GOVERNED_UI_RECIPES = [
  "button",
  "badge",
  "card",
  "surface",
  "status",
  "form-control",
  "table",
  "app-shell",
  "metadata-ui",
] as const;

export type GovernedRecipeName = (typeof GOVERNED_UI_RECIPES)[number];

/**
 * Governed UI components fully covered by:
 * - primitive registry
 * - accessibility registry
 * - recipe governance
 * - component render migration
 *
 * Do not add stock shadcn components here until they are actually governed.
 */
export const GOVERNED_UI_COMPONENTS = [
  "Button",
  "Badge",
  "Card",
  "Alert",
  "Field",
  "Table",
  "Input",
  "Label",
  "Textarea",
  "Checkbox",
  "Switch",
  "Dialog",
  "Popover",
  "Tooltip",
  "Tabs",
  "Select",
  "DropdownMenu",
  "ContextMenu",
  "Menubar",
  "Breadcrumb",
  "Pagination",
  "NavigationMenu",
  "ButtonGroup",
  "Item",
  "Sheet",
  "Drawer",
  "RadioGroup",
  "Separator",
  "Skeleton",
  "ScrollArea",
  "Avatar",
  "AlertDialog",
  "Form",
  "DataTable",
  "Toaster",
  "Progress",
  "Toggle",
  "ToggleGroup",
  "Slider",
  "Accordion",
  "HoverCard",
  "Kbd",
  "Spinner",
  "StatusIndicator",
  "Empty",
  "Collapsible",
  "AspectRatio",
  "Direction",
  "InputGroup",
  "InputOTP",
  "NativeSelect",
  "Command",
  "Combobox",
  "Carousel",
  "Calendar",
  "Chart",
  "Resizable",
  "Sidebar",
] as const;

export type GovernedUiComponentName = (typeof GOVERNED_UI_COMPONENTS)[number];

export function isGovernedRecipeName(
  value: string
): value is GovernedRecipeName {
  return (GOVERNED_UI_RECIPES as readonly string[]).includes(value);
}

export function isGovernedUiComponentName(
  value: string
): value is GovernedUiComponentName {
  return (GOVERNED_UI_COMPONENTS as readonly string[]).includes(value);
}

/** Boundary-safe recipe resolver output. */
export interface GovernedRecipeResult {
  readonly className: string;
  readonly recipeName: GovernedRecipeName;
  readonly selection: VariantSelection;
}

/** Serializable className policy violation record. */
export interface ClassNamePolicyViolation {
  readonly reason:
    | "prohibited-semantic-pattern"
    | "not-approved-layout-pattern"
    | "arbitrary-value";
  readonly token: string;
}

/** Serializable className validation output. */
export interface ClassNamePolicyResult {
  readonly valid: boolean;
  readonly violations: readonly ClassNamePolicyViolation[];
}
