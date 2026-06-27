/**
 * PAS-001 §4.8 — ERP domain vocabulary modules under `src/erp-domain/`.
 *
 * Each domain gets its own folder (`accounting/`, future `inventory/`, …).
 * Shapes-only vocabulary until a domain runtime package is ADR-approved.
 * Not operating-context slots (`context/`) and not platform wire (`contracts/`).
 */

export const ERP_DOMAIN_PAS_SECTION = "4.8" as const;

/** Registered ERP domain module folder names under `packages/kernel/src/erp-domain/`. */
export const ERP_DOMAIN_MODULES = ["accounting"] as const;

export type ErpDomainModule = (typeof ERP_DOMAIN_MODULES)[number];

/** Repo-relative paths to each domain public barrel (`index.ts`). */
export const ERP_DOMAIN_MODULE_INDEX_PATHS = {
  accounting: "packages/kernel/src/erp-domain/accounting/index.ts",
} as const satisfies Record<ErpDomainModule, string>;

export const ERP_DOMAIN_LAYOUT_POLICY = {
  pasSection: ERP_DOMAIN_PAS_SECTION,
  modules: ERP_DOMAIN_MODULES,
  moduleIndexPaths: ERP_DOMAIN_MODULE_INDEX_PATHS,
  subpathExportPattern: "./erp-domain/{module}",
} as const;
