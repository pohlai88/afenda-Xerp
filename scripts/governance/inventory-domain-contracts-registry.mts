/**
 * Inventory domain contracts-only gate registry (PKGR02 / ADR-0020).
 */
export const INVENTORY_DOMAIN_CONTRACTS_GATE =
  "scripts/governance/check-inventory-domain-contracts.mts" as const;

export const INVENTORY_DOMAIN_CONTRACTS_SURFACE_RULE =
  "inventory-domain-contracts-only-no-runtime-posting" as const;

export const INVENTORY_CONTRACTS_ROOT =
  "packages/kernel/src/erp-domain/inventory" as const;

/** Retired per ADR-0020 — must not reappear on disk. */
export const INVENTORY_RETIRED_PACKAGE_ROOT = "packages/inventory" as const;

export const INVENTORY_FORBIDDEN_RELATIVE_DIRS = [
  "packages/kernel/src/erp-domain/inventory/schema",
  "packages/kernel/src/erp-domain/inventory/services",
  "packages/inventory",
] as const;

export const INVENTORY_FORBIDDEN_SOURCE_PATTERNS = [
  /from\s+["']@afenda\/database["']/,
  /from\s+["']drizzle-orm/,
  /packages\/database\/src\/schema/,
] as const;

export const INVENTORY_STOCK_SERVICE_FILENAME_PATTERN = /\.server\.ts$/;

export const INVENTORY_STOCK_SOURCE_KEYWORDS = [
  "postStockMovement",
  "stockPostingService",
  "calculateValuation",
  "allocateWarehouseStock",
] as const;

export const INVENTORY_ERP_FORBIDDEN_ROUTE_DIRS = [
  "apps/erp/src/app/(protected)/modules/inventory",
] as const;

export const INVENTORY_ERP_SOURCE_ROOT = "apps/erp/src" as const;

export const INVENTORY_ERP_FORBIDDEN_IMPORT_PATTERN =
  /from\s+["']@afenda\/inventory["']/;

export const INVENTORY_ERP_SCAN_SKIP_DIR_NAMES = ["__tests__", "e2e"] as const;

export const INVENTORY_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS = [
  "check:inventory-domain-contracts",
] as const;

export const INVENTORY_DOMAIN_CONTRACTS_EVIDENCE = [
  "packages/kernel/src/erp-domain/inventory/index.ts",
  "packages/kernel/src/erp-domain/inventory/inventory-authority.contract.ts",
  "scripts/governance/inventory-domain-contracts-registry.mts",
  "scripts/governance/check-inventory-domain-contracts.mts",
] as const;
