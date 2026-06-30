/**
 * PAS-006B — reusable block slot template families for MCP seed blocks.
 */

import type { BlockDataContractWire } from "../contracts/block-data.contract.js";
import type { BlockSlotRole } from "./block-slot.types.js";

interface BlockSlotTemplateSlot {
  readonly label: string;
  readonly role: BlockSlotRole;
  readonly slotId: string;
}

export interface BlockSlotTemplate {
  readonly contract: Omit<
    BlockDataContractWire,
    "blockId" | "blockDataContractId"
  >;
  readonly slots: readonly BlockSlotTemplateSlot[];
}

export const STATISTICS_METRIC_SLOT_TEMPLATE = {
  slots: [
    { slotId: "metric.label", role: "metric", label: "Metric label" },
    { slotId: "metric.value", role: "metric", label: "Metric value" },
    { slotId: "metric.change", role: "metric", label: "Metric change" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "label",
        slotId: "metric.label",
        kind: "readonly",
        labelAtomRef: "atom.analytics.metric-label",
      },
      {
        fieldKey: "value",
        slotId: "metric.value",
        kind: "number",
        labelAtomRef: "atom.analytics.metric-value",
      },
      {
        fieldKey: "change",
        slotId: "metric.change",
        kind: "readonly",
        labelAtomRef: "atom.analytics.metric-change",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const ACCOUNT_SETTINGS_SLOT_TEMPLATE = {
  slots: [
    { slotId: "profile.avatar", role: "content", label: "Profile avatar" },
    {
      slotId: "profile.displayName",
      role: "form-field",
      label: "Display name",
    },
    { slotId: "profile.email", role: "form-field", label: "Email" },
    { slotId: "profile.save", role: "form-action", label: "Save profile" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "displayName",
        slotId: "profile.displayName",
        kind: "text",
        labelAtomRef: "atom.user.display-name",
        requiredDisplay: true,
      },
      {
        fieldKey: "email",
        slotId: "profile.email",
        kind: "email",
        labelAtomRef: "atom.user.email",
        requiredDisplay: true,
      },
    ],
    actions: [
      {
        actionKey: "save",
        slotId: "profile.save",
        kind: "submit",
        labelAtomRef: "atom.actions.save",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const WIDGET_SLOT_TEMPLATE = {
  slots: [
    { slotId: "widget.title", role: "content", label: "Widget title" },
    { slotId: "widget.summary", role: "metric", label: "Widget summary" },
    { slotId: "widget.action", role: "form-action", label: "Widget action" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "title",
        slotId: "widget.title",
        kind: "readonly",
        labelAtomRef: "atom.dashboard.widget-title",
      },
      {
        fieldKey: "summary",
        slotId: "widget.summary",
        kind: "readonly",
        labelAtomRef: "atom.dashboard.widget-summary",
      },
    ],
    actions: [
      {
        actionKey: "open",
        slotId: "widget.action",
        kind: "navigate",
        labelAtomRef: "atom.actions.open",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const CHART_SLOT_TEMPLATE = {
  slots: [
    { slotId: "chart.title", role: "content", label: "Chart title" },
    { slotId: "chart.series", role: "metric", label: "Chart series" },
    { slotId: "chart.legend", role: "content", label: "Chart legend" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "title",
        slotId: "chart.title",
        kind: "readonly",
        labelAtomRef: "atom.analytics.chart-title",
      },
      {
        fieldKey: "series",
        slotId: "chart.series",
        kind: "readonly",
        labelAtomRef: "atom.analytics.chart-series",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const DROPDOWN_SLOT_TEMPLATE = {
  slots: [
    { slotId: "nav.trigger", role: "navigation", label: "Menu trigger" },
    { slotId: "nav.items", role: "navigation", label: "Menu items" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "label",
        slotId: "nav.trigger",
        kind: "readonly",
        labelAtomRef: "atom.navigation.trigger-label",
      },
    ],
    actions: [
      {
        actionKey: "open-menu",
        slotId: "nav.items",
        kind: "navigate",
        labelAtomRef: "atom.navigation.open-menu",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const ERROR_PAGE_SLOT_TEMPLATE = {
  slots: [
    { slotId: "error.title", role: "content", label: "Error title" },
    { slotId: "error.message", role: "content", label: "Error message" },
    { slotId: "error.action", role: "form-action", label: "Recovery action" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "title",
        slotId: "error.title",
        kind: "readonly",
        labelAtomRef: "atom.error.title",
      },
      {
        fieldKey: "message",
        slotId: "error.message",
        kind: "readonly",
        labelAtomRef: "atom.error.message",
      },
    ],
    actions: [
      {
        actionKey: "recover",
        slotId: "error.action",
        kind: "navigate",
        labelAtomRef: "atom.error.recover",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const DIALOG_SLOT_TEMPLATE = {
  slots: [
    { slotId: "dialog.header", role: "dialog", label: "Dialog header" },
    { slotId: "dialog.body", role: "dialog", label: "Dialog body" },
    { slotId: "dialog.footer", role: "form-action", label: "Dialog footer" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "title",
        slotId: "dialog.header",
        kind: "readonly",
        labelAtomRef: "atom.dialog.title",
      },
      {
        fieldKey: "summary",
        slotId: "dialog.body",
        kind: "readonly",
        labelAtomRef: "atom.dialog.summary",
      },
    ],
    actions: [
      {
        actionKey: "close",
        slotId: "dialog.footer",
        kind: "dialog",
        labelAtomRef: "atom.actions.close",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

export const NAVIGATION_TRIGGER_SLOT_TEMPLATE = {
  slots: [
    { slotId: "nav.trigger", role: "navigation", label: "Navigation trigger" },
  ],
  contract: {
    fields: [
      {
        fieldKey: "label",
        slotId: "nav.trigger",
        kind: "readonly",
        labelAtomRef: "atom.navigation.trigger-label",
      },
    ],
  },
} as const satisfies BlockSlotTemplate;

/** Resolves a slot template for MCP block ids using explicit and family rules. */
export function resolveBlockSlotTemplate(
  blockId: string,
  explicitTemplates: Readonly<Record<string, BlockSlotTemplate>>
): BlockSlotTemplate | undefined {
  const explicit = explicitTemplates[blockId];

  if (explicit !== undefined) {
    return explicit;
  }

  if (blockId.startsWith("statistics-")) {
    return STATISTICS_METRIC_SLOT_TEMPLATE;
  }

  if (blockId.startsWith("account-settings-")) {
    return ACCOUNT_SETTINGS_SLOT_TEMPLATE;
  }

  if (blockId.startsWith("widget-")) {
    return WIDGET_SLOT_TEMPLATE;
  }

  if (blockId.startsWith("chart-")) {
    return CHART_SLOT_TEMPLATE;
  }

  if (blockId.startsWith("dropdown-")) {
    return DROPDOWN_SLOT_TEMPLATE;
  }

  if (blockId.startsWith("error-page-")) {
    return ERROR_PAGE_SLOT_TEMPLATE;
  }

  if (blockId.startsWith("dashboard-dialog-") || blockId === "dialog-search") {
    return DIALOG_SLOT_TEMPLATE;
  }

  if (blockId === "menu-trigger" || blockId === "sidebar-user-dropdown") {
    return NAVIGATION_TRIGGER_SLOT_TEMPLATE;
  }

  return;
}
