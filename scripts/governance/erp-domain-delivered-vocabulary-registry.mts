/**
 * PAS-001B — unified delivered ERP domain vocabulary gate registry.
 * Validates every `delivered` module under packages/kernel/src/erp-domain/.
 */
export const ERP_DOMAIN_DELIVERED_VOCABULARY_GATE =
  "scripts/governance/check-erp-domain-delivered-vocabulary.mts" as const;

export const ERP_DOMAIN_DELIVERED_VOCABULARY_SURFACE_RULE =
  "erp-domain-delivered-vocabulary-contracts-only" as const;

export const ERP_DOMAIN_DELIVERED_VOCABULARY_PACKAGE_SCRIPT =
  "check:erp-domain-delivered-vocabulary" as const;

export const ERP_DOMAIN_DELIVERED_VOCABULARY_GATE_COMMAND =
  "pnpm check:erp-domain-delivered-vocabulary" as const;

export const ERP_DOMAIN_CONTRACTS_ROOT =
  "packages/kernel/src/erp-domain" as const;

export const ERP_DOMAIN_FORBIDDEN_RELATIVE_DIR_SUFFIXES = [
  "schema",
  "services",
] as const;

export const ERP_DOMAIN_FORBIDDEN_SOURCE_PATTERNS = [
  /from\s+["']@afenda\/database["']/,
  /from\s+["']@afenda\/permissions["']/,
  /from\s+["']drizzle-orm/,
  /packages\/database\/src\/schema/,
] as const;

export const ERP_DOMAIN_RUNTIME_SERVICE_FILENAME_PATTERN = /\.server\.ts$/;

export const ERP_DOMAIN_RUNTIME_SOURCE_KEYWORDS = [
  "postJournalEntry",
  "postingService",
  "postStockMovement",
  "postPurchaseOrder",
  "persistToDatabase",
  "drizzleInsert",
] as const;

export const ERP_DOMAIN_MODULE_RETIRED_PACKAGE_ROOTS = {
  accounting: "packages/accounting",
  inventory: "packages/inventory",
} as const satisfies Partial<Record<string, string>>;

export const ERP_DOMAIN_ERP_SOURCE_ROOT = "apps/erp/src" as const;

export const ERP_DOMAIN_ERP_SCAN_SKIP_DIR_NAMES = ["__tests__", "e2e"] as const;

export const ERP_DOMAIN_DELIVERED_VOCABULARY_EVIDENCE = [
  ERP_DOMAIN_DELIVERED_VOCABULARY_GATE,
  "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts",
] as const;
