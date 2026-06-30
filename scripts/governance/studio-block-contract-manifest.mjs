/**
 * PAS-006 Phase 3 — governed block contract ids (keep in sync with block-slot.registry.ts).
 */
export const METADATA_BOUND_BLOCK_TEMPLATE_IDS = [
  "login-page-04",
  "hero-section-01",
  "statistics-card-01",
  "account-settings-01",
  "dialog-activity",
];

export const DATATABLE_BLOCK_CONTRACT_IDS = [
  "datatable-invoice",
  "datatable-user",
  "datatable-product",
];

export const GOVERNED_BLOCK_CONTRACT_IDS = [
  ...METADATA_BOUND_BLOCK_TEMPLATE_IDS,
  ...DATATABLE_BLOCK_CONTRACT_IDS,
];
