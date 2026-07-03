/**
 * PAS-006B P06-003 — block slot registry for seeded MCP blocks.
 */

import type { BlockDataContractWire } from "../meta-contracts/block-data.contract.js";
import type { BlockSlotEntry } from "./block-slot.types.js";
import {
  type BlockSlotTemplate,
  resolveBlockSlotTemplate,
} from "./block-slot-template-families.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "./studio-block-parity.registry.js";

export type { BlockSlotEntry, BlockSlotRole } from "./block-slot.types.js";

const BLOCK_SLOT_TEMPLATES: Readonly<Record<string, BlockSlotTemplate>> = {
  "hero-section-01": {
    slots: [
      { slotId: "hero.title", role: "content", label: "Hero title" },
      { slotId: "hero.subtitle", role: "content", label: "Hero subtitle" },
      { slotId: "hero.cta", role: "form-action", label: "Primary CTA" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "title",
          slotId: "hero.title",
          kind: "text",
          labelAtomRef: "atom.marketing.hero-title",
        },
        {
          fieldKey: "subtitle",
          slotId: "hero.subtitle",
          kind: "text",
          labelAtomRef: "atom.marketing.hero-subtitle",
        },
      ],
      actions: [
        {
          actionKey: "primary-cta",
          slotId: "hero.cta",
          kind: "navigate",
          labelAtomRef: "atom.marketing.hero-cta",
        },
      ],
    },
  },
  "statistics-card-01": {
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
  },
  "account-settings-01": {
    slots: [
      { slotId: "profile.avatar", role: "content", label: "Profile avatar" },
      {
        slotId: "profile.displayName",
        role: "form-field",
        label: "Display name",
      },
      {
        slotId: "profile.displayName.help",
        role: "form-field",
        label: "Display name help text",
      },
      { slotId: "profile.email", role: "form-field", label: "Email" },
      {
        slotId: "profile.email.help",
        role: "form-field",
        label: "Email help text",
      },
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
  },
  "datatable-invoice": {
    slots: [
      { slotId: "table.header", role: "table", label: "Table header" },
      { slotId: "table.rows", role: "table", label: "Table rows" },
      { slotId: "table.actions", role: "form-action", label: "Row actions" },
    ],
    contract: {
      fields: [
        {
          fieldKey: "invoiceNumber",
          slotId: "table.header",
          kind: "readonly",
          labelAtomRef: "atom.invoice.number",
        },
        {
          fieldKey: "amount",
          slotId: "table.rows",
          kind: "number",
          labelAtomRef: "atom.invoice.amount",
        },
      ],
      actions: [
        {
          actionKey: "view-row",
          slotId: "table.actions",
          kind: "navigate",
          labelAtomRef: "atom.actions.view",
        },
      ],
    },
  },
  "dialog-activity": {
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
          labelAtomRef: "atom.activity.title",
        },
        {
          fieldKey: "summary",
          slotId: "dialog.body",
          kind: "readonly",
          labelAtomRef: "atom.activity.summary",
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
  },
};

/** Blocks with explicit slot templates — governed by block contract lane. */
export const METADATA_BOUND_BLOCK_TEMPLATE_IDS = [
  "hero-section-01",
  "statistics-card-01",
  "account-settings-01",
  "dialog-activity",
  "error-page-shell",
] as const;

/** MCP datatable blocks resolved via DATATABLE_SLOT_TEMPLATE family rule. */
export const DATATABLE_BLOCK_CONTRACT_IDS = [
  "datatable-invoice",
  "datatable-user",
  "datatable-product",
] as const;

/** Full block contract gate surface (explicit templates + datatable family). */
export const GOVERNED_BLOCK_CONTRACT_IDS = [
  ...METADATA_BOUND_BLOCK_TEMPLATE_IDS,
  ...DATATABLE_BLOCK_CONTRACT_IDS,
] as const;

export type MetadataBoundBlockTemplateId =
  (typeof METADATA_BOUND_BLOCK_TEMPLATE_IDS)[number];

export type DatatableBlockContractId =
  (typeof DATATABLE_BLOCK_CONTRACT_IDS)[number];

export type GovernedBlockContractId =
  (typeof GOVERNED_BLOCK_CONTRACT_IDS)[number];

function buildBlockSlotRegistry(): readonly BlockSlotEntry[] {
  return SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.flatMap((parity) => {
    const template = resolveBlockSlotTemplate(
      parity.mcpBlockId,
      BLOCK_SLOT_TEMPLATES
    );

    if (template === undefined) {
      return [
        {
          slotId: `${parity.mcpBlockId}.content`,
          blockId: parity.mcpBlockId,
          role: "content",
          label: "Default content slot",
        },
      ] satisfies BlockSlotEntry[];
    }

    return template.slots.map(
      (slot) =>
        ({
          ...slot,
          blockId: parity.mcpBlockId,
        }) satisfies BlockSlotEntry
    );
  });
}

function buildBlockDataContractRegistry(): readonly BlockDataContractWire[] {
  return SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.flatMap((parity) => {
    const template = resolveBlockSlotTemplate(
      parity.mcpBlockId,
      BLOCK_SLOT_TEMPLATES
    );

    if (template === undefined) {
      return [
        {
          blockDataContractId: `block-data-contract:${parity.mcpBlockId}`,
          blockId: parity.mcpBlockId,
          fields: [
            {
              fieldKey: "content",
              slotId: `${parity.mcpBlockId}.content`,
              kind: "readonly",
              labelAtomRef: `atom.presentation.${parity.mcpBlockId}.content`,
            },
          ],
        } satisfies BlockDataContractWire,
      ];
    }

    return [
      {
        blockDataContractId: `block-data-contract:${parity.mcpBlockId}`,
        blockId: parity.mcpBlockId,
        fields: template.contract.fields,
        ...(template.contract.actions === undefined
          ? {}
          : { actions: template.contract.actions }),
      } satisfies BlockDataContractWire,
    ];
  });
}

export const BLOCK_SLOT_REGISTRY = buildBlockSlotRegistry();

export const BLOCK_DATA_CONTRACT_REGISTRY = buildBlockDataContractRegistry();

export function getBlockSlotsForBlockId(
  blockId: string,
  registry: readonly BlockSlotEntry[] = BLOCK_SLOT_REGISTRY
): readonly BlockSlotEntry[] {
  return registry.filter((entry) => entry.blockId === blockId);
}

export function getBlockDataContractForBlockId(
  blockId: string,
  registry: readonly BlockDataContractWire[] = BLOCK_DATA_CONTRACT_REGISTRY
): BlockDataContractWire | undefined {
  return registry.find((entry) => entry.blockId === blockId);
}
