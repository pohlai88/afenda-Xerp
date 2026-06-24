/**
 * Accounting domain contracts-only gate registry (PKG-R01 / ADR-0015).
 *
 * Runtime scans live in `check-accounting-domain-contracts.mts`.
 */
export const ACCOUNTING_DOMAIN_CONTRACTS_GATE =
  "scripts/governance/check-accounting-domain-contracts.mts" as const;

export const ACCOUNTING_DOMAIN_CONTRACTS_SURFACE_RULE =
  "accounting-domain-contracts-only-no-runtime-posting" as const;

export const ACCOUNTING_PACKAGE_ROOT = "packages/accounting" as const;

export const ACCOUNTING_FORBIDDEN_RELATIVE_DIRS = [
  "packages/accounting/src/schema",
  "packages/accounting/src/services",
  "packages/accounting/drizzle",
] as const;

export const ACCOUNTING_ALLOWED_RUNTIME_DEPENDENCIES = [
  "@afenda/kernel",
] as const;

export const ACCOUNTING_FORBIDDEN_DEPENDENCIES = [
  "@afenda/database",
  "drizzle-orm",
] as const;

export const ACCOUNTING_FORBIDDEN_SOURCE_PATTERNS = [
  /from\s+["']@afenda\/database["']/,
  /from\s+["']drizzle-orm/,
  /packages\/database\/src\/schema/,
] as const;

export const ACCOUNTING_POSTING_SERVICE_FILENAME_PATTERN = /\.server\.ts$/;

export const ACCOUNTING_POSTING_SOURCE_KEYWORDS = [
  "postJournalEntry",
  "postingService",
  "ledgerBalance",
  "calculateElimination",
] as const;

/** Dedicated ERP accounting routes are blocked until TIP-015+ UI ADR. */
export const ACCOUNTING_ERP_FORBIDDEN_ROUTE_DIRS = [
  "apps/erp/src/app/(protected)/modules/accounting",
  "apps/erp/src/app/(protected)/accounting",
] as const;

export const ACCOUNTING_ERP_SOURCE_ROOT = "apps/erp/src" as const;

export const ACCOUNTING_ERP_FORBIDDEN_IMPORT_PATTERN =
  /from\s+["']@afenda\/accounting["']/;

export const ACCOUNTING_ERP_SCAN_SKIP_DIR_NAMES = ["__tests__", "e2e"] as const;

export const ACCOUNTING_DOMAIN_CONTRACTS_PACKAGE_SCRIPTS = [
  "check:accounting-domain-contracts",
  "quality:accounting-domain-contracts",
] as const;

export const ACCOUNTING_DOMAIN_CONTRACTS_EVIDENCE = [
  "packages/accounting/src/index.ts",
  "packages/accounting/src/contracts/accounting-authority.contract.ts",
  "scripts/governance/accounting-domain-contracts-registry.mts",
  "scripts/governance/check-accounting-domain-contracts.mts",
] as const;
