import type { GovernedPrimitiveDefinition } from "./primitive-contract";
import {
  alertSlotClassNames,
  cardSlotClassNames,
  checkboxIndicatorSlotClassName,
  checkboxRootSlotClassName,
  fieldSlotClassNames,
  fieldSlotClassNamesByKey,
  formControlLeafSizeClassNames,
  inputRootSlotClassName,
  labelRootSlotClassName,
  switchRootSlotClassName,
  switchSizeClassNamesByKey,
  switchThumbSlotClassName,
  tableSlotClassNames,
  textareaRootSlotClassName,
} from "./recipe-maps";
import type { GovernedUiComponentName } from "./types";
import { GOVERNED_UI_COMPONENTS } from "./types";

export const GOVERNED_PRIMITIVE_REGISTRY = {
  Button: {
    componentName: "Button",
    recipeName: "button",
    sourceFile: "src/components/button.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "feedback",
    allowAsChild: true,
    dataSlotByRole: { root: "button" },
    slotClassNames: {},
  },
  Badge: {
    componentName: "Badge",
    recipeName: "badge",
    sourceFile: "src/components/badge.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "instant",
    allowAsChild: true,
    dataSlotByRole: { root: "badge" },
    slotClassNames: {},
  },
  Card: {
    componentName: "Card",
    recipeName: "card",
    sourceFile: "src/components/card.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root", "header", "label", "body", "actions", "content", "footer"],
    motion: "instant",
    allowAsChild: false,
    dataSlotByRole: {
      root: "card",
      header: "card-header",
      content: "card-content",
      footer: "card-footer",
      actions: "card-action",
      label: "card-title",
      body: "card-description",
    },
    slotClassNames: cardSlotClassNames,
  },
  Alert: {
    componentName: "Alert",
    recipeName: "status",
    sourceFile: "src/components/alert.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root", "label", "body", "actions"],
    motion: "instant",
    allowAsChild: false,
    dataSlotByRole: {
      root: "alert",
      label: "alert-title",
      body: "alert-description",
      actions: "alert-action",
    },
    slotClassNames: alertSlotClassNames,
  },
  Field: {
    componentName: "Field",
    recipeName: "form-control",
    sourceFile: "src/components/field.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: [
      "root",
      "header",
      "body",
      "label",
      "content",
      "control",
      "state",
      "footer",
      "actions",
    ],
    motion: "instant",
    allowAsChild: false,
    controlPresentation: "group",
    dataSlotByRole: {
      root: "field",
      header: "field-set",
      body: "field-group",
      label: "field-legend",
      content: "field-content",
      control: "field-label",
      state: "field-description",
      footer: "field-separator",
      actions: "field-error",
    },
    slotClassNames: fieldSlotClassNames,
    slotClassNamesByKey: fieldSlotClassNamesByKey,
    dataSlotByKey: {
      title: "field-label",
      separatorContent: "field-separator-content",
      errorList: "field-error-list",
    },
  },
  Table: {
    componentName: "Table",
    recipeName: "table",
    sourceFile: "src/components/table.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: [
      "root",
      "body",
      "header",
      "content",
      "footer",
      "label",
      "control",
      "icon",
      "state",
    ],
    motion: "instant",
    allowAsChild: false,
    dataSlotByRole: {
      root: "table",
      body: "table-container",
      header: "table-header",
      content: "table-body",
      footer: "table-footer",
      label: "table-row",
      control: "table-head",
      icon: "table-cell",
      state: "table-caption",
    },
    slotClassNames: tableSlotClassNames,
  },
  Input: {
    componentName: "Input",
    recipeName: "form-control",
    sourceFile: "src/components/input.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "instant",
    allowAsChild: false,
    controlPresentation: "leaf",
    dataSlotByRole: { root: "input" },
    slotClassNames: { root: inputRootSlotClassName },
    slotClassNamesByKey: formControlLeafSizeClassNames,
  },
  Label: {
    componentName: "Label",
    recipeName: "form-control",
    sourceFile: "src/components/label.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "instant",
    allowAsChild: false,
    controlPresentation: "leaf",
    dataSlotByRole: { root: "label" },
    slotClassNames: { root: labelRootSlotClassName },
  },
  Textarea: {
    componentName: "Textarea",
    recipeName: "form-control",
    sourceFile: "src/components/textarea.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "instant",
    allowAsChild: false,
    controlPresentation: "leaf",
    dataSlotByRole: { root: "textarea" },
    slotClassNames: { root: textareaRootSlotClassName },
    slotClassNamesByKey: formControlLeafSizeClassNames,
  },
  Checkbox: {
    componentName: "Checkbox",
    recipeName: "form-control",
    sourceFile: "src/components/checkbox.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "instant",
    allowAsChild: false,
    controlPresentation: "leaf",
    dataSlotByRole: { root: "checkbox" },
    slotClassNames: { root: checkboxRootSlotClassName },
    slotClassNamesByKey: { indicator: checkboxIndicatorSlotClassName },
    dataSlotByKey: { indicator: "checkbox-indicator" },
  },
  Switch: {
    componentName: "Switch",
    recipeName: "form-control",
    sourceFile: "src/components/switch.tsx",
    defaultState: "ready",
    defaultSlot: "root",
    slots: ["root"],
    motion: "feedback",
    allowAsChild: false,
    controlPresentation: "leaf",
    dataSlotByRole: { root: "switch" },
    slotClassNames: { root: switchRootSlotClassName },
    slotClassNamesByKey: {
      thumb: switchThumbSlotClassName,
      ...switchSizeClassNamesByKey,
    },
    dataSlotByKey: { thumb: "switch-thumb" },
  },
} as const satisfies Record<GovernedUiComponentName, GovernedPrimitiveDefinition>;

/** Governed component source paths — enforced by CI in phase 1. */
export const GOVERNED_COMPONENT_SOURCE_FILES = GOVERNED_UI_COMPONENTS.map(
  (componentName) => GOVERNED_PRIMITIVE_REGISTRY[componentName].sourceFile
);

/**
 * Stock shadcn/Radix components not yet wired through primitive governance.
 * Every exported component must appear here or in {@link GOVERNED_PRIMITIVE_REGISTRY}.
 */
export const STOCK_SHADCN_PENDING = [
  "src/components/accordion.tsx",
  "src/components/alert-dialog.tsx",
  "src/components/aspect-ratio.tsx",
  "src/components/avatar.tsx",
  "src/components/breadcrumb.tsx",
  "src/components/button-group.tsx",
  "src/components/calendar.tsx",
  "src/components/carousel.tsx",
  "src/components/chart.tsx",
  "src/components/collapsible.tsx",
  "src/components/combobox.tsx",
  "src/components/command.tsx",
  "src/components/context-menu.tsx",
  "src/components/data-table.tsx",
  "src/components/dialog.tsx",
  "src/components/direction.tsx",
  "src/components/drawer.tsx",
  "src/components/dropdown-menu.tsx",
  "src/components/empty.tsx",
  "src/components/form.tsx",
  "src/components/hover-card.tsx",
  "src/components/input-group.tsx",
  "src/components/input-otp.tsx",
  "src/components/item.tsx",
  "src/components/kbd.tsx",
  "src/components/menubar.tsx",
  "src/components/native-select.tsx",
  "src/components/navigation-menu.tsx",
  "src/components/pagination.tsx",
  "src/components/popover.tsx",
  "src/components/progress.tsx",
  "src/components/radio-group.tsx",
  "src/components/resizable.tsx",
  "src/components/scroll-area.tsx",
  "src/components/select.tsx",
  "src/components/separator.tsx",
  "src/components/sheet.tsx",
  "src/components/sidebar.tsx",
  "src/components/skeleton.tsx",
  "src/components/slider.tsx",
  "src/components/sonner.tsx",
  "src/components/spinner.tsx",
  "src/components/tabs.tsx",
  "src/components/toggle-group.tsx",
  "src/components/toggle.tsx",
  "src/components/tooltip.tsx",
] as const;

export type StockShadcnPendingFile = (typeof STOCK_SHADCN_PENDING)[number];

/** PascalCase exports from index.ts that map to stock pending files. */
export const EXPORTED_STOCK_COMPONENTS = [
  "AlertDialog",
  "Avatar",
  "DataTable",
  "Dialog",
  "Form",
  "RadioGroup",
  "ScrollArea",
  "Select",
  "Separator",
  "Sheet",
  "Skeleton",
  "Toaster",
  "Tooltip",
] as const;

const governedSourceFileSet = new Set<string>(GOVERNED_COMPONENT_SOURCE_FILES);
const stockPendingSourceFileSet = new Set<string>(STOCK_SHADCN_PENDING);

export function isGovernedPrimitive(
  componentName: string
): componentName is GovernedUiComponentName {
  return Object.hasOwn(GOVERNED_PRIMITIVE_REGISTRY, componentName);
}

export function getPrimitiveDefinition(
  componentName: GovernedUiComponentName
): GovernedPrimitiveDefinition {
  return GOVERNED_PRIMITIVE_REGISTRY[componentName];
}

export function isGovernedSourceFile(relativePath: string): boolean {
  return governedSourceFileSet.has(relativePath);
}

export function isStockPendingSourceFile(relativePath: string): boolean {
  return stockPendingSourceFileSet.has(relativePath);
}

export const PRIMARY_UI_EXPORTS = [
  ...GOVERNED_UI_COMPONENTS,
  ...EXPORTED_STOCK_COMPONENTS,
] as const;

export function assertComponentExportCoverage(componentExportName: string): void {
  if (isGovernedPrimitive(componentExportName)) {
    return;
  }

  if (
    (EXPORTED_STOCK_COMPONENTS as readonly string[]).includes(componentExportName)
  ) {
    return;
  }

  throw new Error(
    `TIP-004B export coverage violation. "${componentExportName}" is exported from @afenda/ui but is not registered as governed or stock pending.`
  );
}
