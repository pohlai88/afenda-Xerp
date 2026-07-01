/**
 * PAS-006D P06-009 — surface template registry.
 */

import type { SurfaceTemplateContractWire } from "../meta-contracts/surface-template.contract.js";
import { BLOCK_DATA_CONTRACT_REGISTRY } from "./block-slot.registry.js";

export const SURFACE_TEMPLATE_REGISTRY = [
  {
    acceptanceRecordIds: ["acceptance-record:account-settings-01"],
    blockBindings: [
      {
        blockId: "account-settings-01",
        slotFills: {
          "profile.displayName": "profile.displayName",
          "profile.email": "profile.email",
        },
      },
    ],
    metadataBindingId: "metadata-binding.account-settings-01",
    surfaceTemplateId: "surface-template.account-settings",
    templateClass: "settings",
  },
  {
    acceptanceRecordIds: ["acceptance-record:login-page-04"],
    blockBindings: [
      {
        blockId: "login-page-04",
        slotFills: {
          "login.email": "login.email",
          "login.password": "login.password",
        },
      },
    ],
    metadataBindingId: "metadata-binding.login-page-04",
    surfaceTemplateId: "surface-template.auth-sign-in",
    templateClass: "form",
  },
  {
    acceptanceRecordIds: ["acceptance-record:datatable-invoice"],
    blockBindings: [
      {
        blockId: "datatable-invoice",
        slotFills: {
          "table.header": "table.header",
          "table.rows": "table.rows",
        },
      },
    ],
    metadataBindingId: "metadata-binding.datatable-invoice",
    surfaceTemplateId: "surface-template.invoice-table",
    templateClass: "table",
  },
  {
    acceptanceRecordIds: ["acceptance-record:statistics-card-01"],
    blockBindings: [
      {
        blockId: "statistics-card-01",
        slotFills: {
          "metric.label": "metric.label",
          "metric.value": "metric.value",
        },
      },
    ],
    metadataBindingId: "metadata-binding.statistics-card-01",
    surfaceTemplateId: "surface-template.analytics-metric",
    templateClass: "dashboard",
  },
  {
    acceptanceRecordIds: ["acceptance-record:hero-section-01"],
    blockBindings: [
      {
        blockId: "hero-section-01",
        slotFills: {
          "hero.title": "hero.title",
          "hero.subtitle": "hero.subtitle",
        },
      },
    ],
    metadataBindingId: "metadata-binding.hero-section-01",
    surfaceTemplateId: "surface-template.marketing-hero",
    templateClass: "dashboard",
  },
] as const satisfies readonly SurfaceTemplateContractWire[];

export function getSurfaceTemplateById(
  surfaceTemplateId: string,
  registry: readonly SurfaceTemplateContractWire[] = SURFACE_TEMPLATE_REGISTRY
): SurfaceTemplateContractWire | undefined {
  return registry.find(
    (template) => template.surfaceTemplateId === surfaceTemplateId
  );
}

export function assertSurfaceTemplateMetadataBinding(
  template: SurfaceTemplateContractWire
): boolean {
  return template.metadataBindingId.trim().length > 0;
}

export function assertSurfaceTemplateBlockDataCoverage(
  template: SurfaceTemplateContractWire
): boolean {
  return template.blockBindings.every((binding) =>
    BLOCK_DATA_CONTRACT_REGISTRY.some(
      (contract) => contract.blockId === binding.blockId
    )
  );
}
