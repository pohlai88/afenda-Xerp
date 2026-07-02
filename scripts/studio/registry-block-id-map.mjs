/**
 * @ss-blocks registry name ↔ filesystem blockId mapping (base-vega-install SSOT).
 */

/** registry id (statistics-component-01) → blockId (statistics-card-01) */
const SS_BLOCKS_PREFIX_RE = /^@ss-blocks\//;
const TSX_SUFFIX_RE = /\.tsx$/;

export const REGISTRY_NAME_TO_BLOCK_ID = {
  "statistics-component-01": "statistics-card-01",
  "statistics-component-02": "statistics-card-02",
  "chart-component-01": "chart-sales-metrics",
  "datatable-component-04": "datatable-user",
  "datatable-component-05": "datatable-invoice",
  "datatable-component-06": "datatable-product",
  "widget-component-01": "widget-total-earning",
  "widget-component-03": "widget-transactions",
  "widget-component-14": "widget-payment-history",
  "application-shell-02": "application-shell-02",
};

/** blockId → @ss-blocks registry id when known */
export const BLOCK_ID_TO_REGISTRY_NAME = Object.fromEntries(
  Object.entries(REGISTRY_NAME_TO_BLOCK_ID).map(([registry, blockId]) => [
    blockId,
    `@ss-blocks/${registry}`,
  ])
);

export function resolveBlockIdFromRegistryArg(registryArg) {
  if (!registryArg) {
    return null;
  }

  const normalized = registryArg.replace(SS_BLOCKS_PREFIX_RE, "");
  if (REGISTRY_NAME_TO_BLOCK_ID[normalized]) {
    return REGISTRY_NAME_TO_BLOCK_ID[normalized];
  }

  if (normalized.endsWith(".tsx")) {
    return normalized.replace(TSX_SUFFIX_RE, "");
  }

  return normalized;
}

export function resolveSourceRegistry(blockId) {
  return BLOCK_ID_TO_REGISTRY_NAME[blockId] ?? null;
}
