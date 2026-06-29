/**
 * PAS-006D — metadata binding registry (presentation layer wire contracts).
 */

import type { MetadataBindingContractWire } from "../contracts/metadata-binding.contract.js";

export const METADATA_BINDING_REGISTRY = [
  {
    blockId: "account-settings-01",
    erpDomainKvId: "KV-HCM",
    erpDomainModuleSlug: "hcm",
    fields: [
      {
        fieldKey: "displayName",
        slotId: "profile.displayName",
        presentationKind: "text",
        labelAtomRef: "atom.user.display-name",
        requiredDisplay: true,
      },
      {
        fieldKey: "email",
        slotId: "profile.email",
        presentationKind: "text",
        labelAtomRef: "atom.user.email",
        requiredDisplay: true,
      },
    ],
    metadataBindingId: "metadata-binding.account-settings-01",
    surfaceTemplateClass: "settings",
  },
  {
    blockId: "login-page-04",
    erpDomainKvId: "KV-HCM",
    erpDomainModuleSlug: "hcm",
    fields: [
      {
        fieldKey: "email",
        slotId: "login.email",
        presentationKind: "text",
        labelAtomRef: "atom.auth.email",
        requiredDisplay: true,
      },
      {
        fieldKey: "password",
        slotId: "login.password",
        presentationKind: "text",
        labelAtomRef: "atom.auth.password",
        requiredDisplay: true,
      },
    ],
    metadataBindingId: "metadata-binding.login-page-04",
    surfaceTemplateClass: "form",
  },
  {
    blockId: "datatable-invoice",
    erpDomainKvId: "KV-INV",
    erpDomainModuleSlug: "inventory",
    fields: [
      {
        fieldKey: "invoiceNumber",
        slotId: "table.header",
        presentationKind: "readonly",
        labelAtomRef: "atom.invoice.number",
      },
      {
        fieldKey: "amount",
        slotId: "table.rows",
        presentationKind: "number",
        labelAtomRef: "atom.invoice.amount",
      },
    ],
    metadataBindingId: "metadata-binding.datatable-invoice",
    surfaceTemplateClass: "table",
  },
  {
    blockId: "statistics-card-01",
    erpDomainKvId: "KV-INV",
    erpDomainModuleSlug: "inventory",
    fields: [
      {
        fieldKey: "label",
        slotId: "metric.label",
        presentationKind: "readonly",
        labelAtomRef: "atom.analytics.metric-label",
      },
      {
        fieldKey: "value",
        slotId: "metric.value",
        presentationKind: "number",
        labelAtomRef: "atom.analytics.metric-value",
      },
    ],
    metadataBindingId: "metadata-binding.statistics-card-01",
    surfaceTemplateClass: "dashboard",
  },
  {
    blockId: "hero-section-01",
    erpDomainKvId: "KV-INV",
    erpDomainModuleSlug: "inventory",
    fields: [
      {
        fieldKey: "title",
        slotId: "hero.title",
        presentationKind: "text",
        labelAtomRef: "atom.marketing.hero-title",
      },
      {
        fieldKey: "subtitle",
        slotId: "hero.subtitle",
        presentationKind: "text",
        labelAtomRef: "atom.marketing.hero-subtitle",
      },
    ],
    metadataBindingId: "metadata-binding.hero-section-01",
    surfaceTemplateClass: "dashboard",
  },
] as const satisfies readonly MetadataBindingContractWire[];

export function getMetadataBindingById(
  metadataBindingId: string,
  registry: readonly MetadataBindingContractWire[] = METADATA_BINDING_REGISTRY
): MetadataBindingContractWire | undefined {
  return registry.find(
    (binding) => binding.metadataBindingId === metadataBindingId
  );
}
