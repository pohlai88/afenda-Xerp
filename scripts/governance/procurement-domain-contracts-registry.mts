/**
 * Procurement domain contracts-only gate registry (PAS-001B B80).
 */
export const PROCUREMENT_DOMAIN_CONTRACTS_GATE =
  "scripts/governance/check-procurement-domain-contracts.mts" as const;

export const PROCUREMENT_DOMAIN_CONTRACTS_SURFACE_RULE =
  "procurement-domain-contracts-only-no-runtime-posting" as const;

export const PROCUREMENT_CONTRACTS_ROOT =
  "packages/kernel/src/erp-domain/procurement" as const;

export const PROCUREMENT_FORBIDDEN_RELATIVE_DIRS = [
  "packages/kernel/src/erp-domain/procurement/schema",
  "packages/kernel/src/erp-domain/procurement/services",
  "packages/procurement",
] as const;

export const PROCUREMENT_FORBIDDEN_SOURCE_PATTERNS = [
  /from\s+["']@afenda\/database["']/,
  /from\s+["']drizzle-orm/,
  /packages\/database\/src\/schema/,
] as const;

export const PROCUREMENT_POSTING_SERVICE_FILENAME_PATTERN = /\.server\.ts$/;

export const PROCUREMENT_POSTING_SOURCE_KEYWORDS = [
  "postPurchaseOrder",
  "procurementPostingService",
  "matchGoodsReceipt",
  "releaseBlanketAgreement",
] as const;

export const PROCUREMENT_ERP_FORBIDDEN_ROUTE_DIRS = [
  "apps/erp/src/app/(protected)/modules/procurement",
] as const;

/** ERP-PROC-OP-005 — sole authorized procurement ERP routes until business runtime slice. */
export const PROCUREMENT_ERP_AUTHORIZED_FOUNDATION_ROUTE_FILES = [
  "apps/erp/src/app/(protected)/modules/procurement/readiness/page.tsx",
  "apps/erp/src/lib/procurement/load-procurement-foundation-readiness-page.server.ts",
  "apps/erp/src/app/(protected)/modules/procurement/requisitions/page.tsx",
  "apps/erp/src/lib/procurement/load-procurement-requisitions-page.server.ts",
  "apps/erp/src/app/(protected)/modules/procurement/purchase-orders/page.tsx",
  "apps/erp/src/lib/procurement/load-procurement-purchase-orders-page.server.ts",
] as const;

export const PROCUREMENT_ERP_SOURCE_ROOT = "apps/erp/src" as const;

export const PROCUREMENT_ERP_FORBIDDEN_IMPORT_PATTERN =
  /from\s+["']@afenda\/procurement["']/;

export const PROCUREMENT_ERP_SCAN_SKIP_DIR_NAMES = [
  "__tests__",
  "e2e",
] as const;

export const PROCUREMENT_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS = [
  "check:procurement-domain-contracts",
] as const;

export const PROCUREMENT_DOMAIN_CONTRACTS_EVIDENCE = [
  "packages/kernel/src/erp-domain/procurement/index.ts",
  "packages/kernel/src/erp-domain/procurement/procurement-authority.contract.ts",
  "scripts/governance/procurement-domain-contracts-registry.mts",
  "scripts/governance/check-procurement-domain-contracts.mts",
] as const;
