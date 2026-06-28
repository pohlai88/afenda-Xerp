/**
 * PAS-001 §4.8 · PAS-001B — ERP domain vocabulary catalog under `src/erp-domain/`.
 *
 * Catalog-only modules exist in this contract only (no filesystem folder until B79+ slice).
 * Shapes-only vocabulary until a domain runtime package is ADR-approved.
 * Not operating-context slots (`context/`) and not platform wire (`contracts/`).
 */

export const ERP_DOMAIN_PAS_SECTION = "4.8" as const;

export const ERP_DOMAIN_PAS_001B_ID = "PAS-001B" as const;

export const ERP_DOMAIN_LOB_PILLARS = [
  "finance",
  "scm",
  "sales-cx",
  "service",
  "marketing",
  "hcm-projects",
  "platform-erp",
] as const;

export type ErpDomainLobPillar = (typeof ERP_DOMAIN_LOB_PILLARS)[number];

export const ERP_DOMAIN_MODULE_MATURITY_VALUES = [
  "delivered",
  "catalog-only",
  "blocked",
] as const;

export type ErpDomainModuleMaturity =
  (typeof ERP_DOMAIN_MODULE_MATURITY_VALUES)[number];

/** Registered ERP domain module slugs (PAS-001B full-suite catalog). */
export const ERP_DOMAIN_MODULES = [
  "accounting",
  "controlling",
  "treasury",
  "tax",
  "consolidation",
  "intercompany",
  "procurement",
  "inventory",
  "manufacturing",
  "quality",
  "maintenance",
  "supply-chain",
  "sales",
  "crm",
  "pricing",
  "subscription",
  "ecommerce",
  "pos",
  "service",
  "field-service",
  "marketing",
  "hcm",
  "payroll",
  "project",
  "assets",
  "document",
  "workflow",
  "analytics",
] as const;

export type ErpDomainModule = (typeof ERP_DOMAIN_MODULES)[number];

export interface ErpDomainModuleMetadata {
  readonly lobPillar: ErpDomainLobPillar;
  readonly odooAnchor: string;
  readonly oracleAnchor: string;
  /** ADR-gated runtime lane cross-reference only — never implies vocabulary delivery. */
  readonly runtimeOwnerPackage: string | null;
  readonly sapAnchor: string;
  readonly vocabularyGate: string | null;
}

/** PAS-001B §3 slug scope notes — disambiguates broad or platform-adjacent catalog slugs. */
export const ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS = {
  "supply-chain":
    "Logistics and fulfillment orchestration vocabulary only (transport, warehouse movements, delivery status). Does not subsume inventory, procurement, or manufacturing module vocabularies.",
  document:
    "ERP business document vocabulary (posting attachments, fiscal document types, retention classes). Not platform document storage, CMS, or kernel wire document contracts.",
} as const satisfies Partial<Record<ErpDomainModule, string>>;

/**
 * External runtime lane references for catalog-only slugs.
 * Cross-links PKGR rows without implying kernel vocabulary delivery.
 * Delivered slugs must not appear here (see check:erp-domain-layout).
 */
export const ERP_DOMAIN_EXTERNAL_RUNTIME_REFERENCES =
  {} as const satisfies Partial<Record<ErpDomainModule, string>>;

/** Expected full-suite catalog size — must match PAS-001B §3 table row count. */
export const ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT = 28 as const;

export const ERP_DOMAIN_MODULE_MATURITY = {
  accounting: "delivered",
  controlling: "delivered",
  treasury: "delivered",
  tax: "delivered",
  consolidation: "delivered",
  intercompany: "delivered",
  procurement: "delivered",
  inventory: "delivered",
  manufacturing: "delivered",
  quality: "delivered",
  maintenance: "delivered",
  "supply-chain": "delivered",
  sales: "delivered",
  crm: "delivered",
  pricing: "delivered",
  subscription: "delivered",
  ecommerce: "delivered",
  pos: "delivered",
  service: "delivered",
  "field-service": "delivered",
  marketing: "delivered",
  hcm: "delivered",
  payroll: "delivered",
  project: "delivered",
  assets: "delivered",
  document: "delivered",
  workflow: "delivered",
  analytics: "delivered",
} as const satisfies Record<ErpDomainModule, ErpDomainModuleMaturity>;

export const ERP_DOMAIN_MODULE_METADATA = {
  accounting: {
    lobPillar: "finance",
    sapAnchor: "FI",
    oracleAnchor: "Financials",
    odooAnchor: "Accounting",
    runtimeOwnerPackage: "PKGR01_ACCOUNTING",
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  controlling: {
    lobPillar: "finance",
    sapAnchor: "CO",
    oracleAnchor: "EPM",
    odooAnchor: "Analytic",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  treasury: {
    lobPillar: "finance",
    sapAnchor: "TR",
    oracleAnchor: "Cash Management",
    odooAnchor: "—",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  tax: {
    lobPillar: "finance",
    sapAnchor: "Tax",
    oracleAnchor: "Indirect Tax",
    odooAnchor: "Taxes",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  consolidation: {
    lobPillar: "finance",
    sapAnchor: "Group Reporting",
    oracleAnchor: "FCCS",
    odooAnchor: "Consolidation",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  intercompany: {
    lobPillar: "finance",
    sapAnchor: "IC",
    oracleAnchor: "Intercompany",
    odooAnchor: "—",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  procurement: {
    lobPillar: "scm",
    sapAnchor: "MM-PUR",
    oracleAnchor: "Procurement",
    odooAnchor: "Purchase",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  inventory: {
    lobPillar: "scm",
    sapAnchor: "MM-IM",
    oracleAnchor: "Inventory",
    odooAnchor: "Inventory",
    runtimeOwnerPackage: "PKGR02_INVENTORY",
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  manufacturing: {
    lobPillar: "scm",
    sapAnchor: "PP",
    oracleAnchor: "Manufacturing",
    odooAnchor: "MRP",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  quality: {
    lobPillar: "scm",
    sapAnchor: "QM",
    oracleAnchor: "Quality",
    odooAnchor: "Quality",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  maintenance: {
    lobPillar: "scm",
    sapAnchor: "PM",
    oracleAnchor: "Maintenance",
    odooAnchor: "Maintenance",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  "supply-chain": {
    lobPillar: "scm",
    sapAnchor: "LE-WM",
    oracleAnchor: "Logistics",
    odooAnchor: "Delivery",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  sales: {
    lobPillar: "sales-cx",
    sapAnchor: "SD",
    oracleAnchor: "Order Management",
    odooAnchor: "Sales",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  crm: {
    lobPillar: "sales-cx",
    sapAnchor: "CRM",
    oracleAnchor: "Sales Cloud",
    odooAnchor: "CRM",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  pricing: {
    lobPillar: "sales-cx",
    sapAnchor: "SD-Pricing",
    oracleAnchor: "Pricing",
    odooAnchor: "Pricelists",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  subscription: {
    lobPillar: "sales-cx",
    sapAnchor: "BRIM",
    oracleAnchor: "Subscription",
    odooAnchor: "Subscriptions",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  ecommerce: {
    lobPillar: "sales-cx",
    sapAnchor: "—",
    oracleAnchor: "—",
    odooAnchor: "eCommerce",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  pos: {
    lobPillar: "sales-cx",
    sapAnchor: "—",
    oracleAnchor: "—",
    odooAnchor: "POS",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  service: {
    lobPillar: "service",
    sapAnchor: "CS",
    oracleAnchor: "Service Cloud",
    odooAnchor: "Helpdesk",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  "field-service": {
    lobPillar: "service",
    sapAnchor: "—",
    oracleAnchor: "Field Service",
    odooAnchor: "Field Service",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  marketing: {
    lobPillar: "marketing",
    sapAnchor: "—",
    oracleAnchor: "Marketing Cloud",
    odooAnchor: "Marketing",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  hcm: {
    lobPillar: "hcm-projects",
    sapAnchor: "HCM",
    oracleAnchor: "Core HR",
    odooAnchor: "Employees",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  payroll: {
    lobPillar: "hcm-projects",
    sapAnchor: "PY",
    oracleAnchor: "Payroll",
    odooAnchor: "Payroll",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  project: {
    lobPillar: "hcm-projects",
    sapAnchor: "PS",
    oracleAnchor: "PPM",
    odooAnchor: "Project",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  assets: {
    lobPillar: "hcm-projects",
    sapAnchor: "AA",
    oracleAnchor: "Fixed Assets",
    odooAnchor: "Assets",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  document: {
    lobPillar: "platform-erp",
    sapAnchor: "DMS",
    oracleAnchor: "Documents",
    odooAnchor: "Documents",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  workflow: {
    lobPillar: "platform-erp",
    sapAnchor: "WF",
    oracleAnchor: "Approvals",
    odooAnchor: "Approvals",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
  analytics: {
    lobPillar: "platform-erp",
    sapAnchor: "BW",
    oracleAnchor: "OTBI",
    odooAnchor: "Spreadsheet",
    runtimeOwnerPackage: null,
    vocabularyGate: "pnpm check:erp-domain-delivered-vocabulary",
  },
} as const satisfies Record<ErpDomainModule, ErpDomainModuleMetadata>;

/** Repo-relative paths to each delivered domain public barrel (`index.ts`). */
export const ERP_DOMAIN_MODULE_INDEX_PATHS = {
  accounting: "packages/kernel/src/erp-domain/accounting/index.ts",
  controlling: "packages/kernel/src/erp-domain/controlling/index.ts",
  treasury: "packages/kernel/src/erp-domain/treasury/index.ts",
  tax: "packages/kernel/src/erp-domain/tax/index.ts",
  consolidation: "packages/kernel/src/erp-domain/consolidation/index.ts",
  intercompany: "packages/kernel/src/erp-domain/intercompany/index.ts",
  procurement: "packages/kernel/src/erp-domain/procurement/index.ts",
  inventory: "packages/kernel/src/erp-domain/inventory/index.ts",
  manufacturing: "packages/kernel/src/erp-domain/manufacturing/index.ts",
  quality: "packages/kernel/src/erp-domain/quality/index.ts",
  maintenance: "packages/kernel/src/erp-domain/maintenance/index.ts",
  "supply-chain": "packages/kernel/src/erp-domain/supply-chain/index.ts",
  sales: "packages/kernel/src/erp-domain/sales/index.ts",
  crm: "packages/kernel/src/erp-domain/crm/index.ts",
  pricing: "packages/kernel/src/erp-domain/pricing/index.ts",
  subscription: "packages/kernel/src/erp-domain/subscription/index.ts",
  ecommerce: "packages/kernel/src/erp-domain/ecommerce/index.ts",
  pos: "packages/kernel/src/erp-domain/pos/index.ts",
  service: "packages/kernel/src/erp-domain/service/index.ts",
  "field-service": "packages/kernel/src/erp-domain/field-service/index.ts",
  marketing: "packages/kernel/src/erp-domain/marketing/index.ts",
  hcm: "packages/kernel/src/erp-domain/hcm/index.ts",
  payroll: "packages/kernel/src/erp-domain/payroll/index.ts",
  project: "packages/kernel/src/erp-domain/project/index.ts",
  assets: "packages/kernel/src/erp-domain/assets/index.ts",
  document: "packages/kernel/src/erp-domain/document/index.ts",
  workflow: "packages/kernel/src/erp-domain/workflow/index.ts",
  analytics: "packages/kernel/src/erp-domain/analytics/index.ts",
} as const satisfies Partial<Record<ErpDomainModule, string>>;

export const ERP_DOMAIN_DELIVERED_MODULES = ERP_DOMAIN_MODULES.filter(
  (slug) => ERP_DOMAIN_MODULE_MATURITY[slug] === "delivered"
);

export const ERP_DOMAIN_LAYOUT_POLICY = {
  pasSection: ERP_DOMAIN_PAS_SECTION,
  pas001bId: ERP_DOMAIN_PAS_001B_ID,
  moduleCount: ERP_DOMAIN_MODULES.length,
  deliveredModuleCount: ERP_DOMAIN_DELIVERED_MODULES.length,
  modules: ERP_DOMAIN_MODULES,
  moduleMaturity: ERP_DOMAIN_MODULE_MATURITY,
  moduleMetadata: ERP_DOMAIN_MODULE_METADATA,
  moduleIndexPaths: ERP_DOMAIN_MODULE_INDEX_PATHS,
  subpathExportPattern: "./erp-domain/{module}",
  layoutGate: "pnpm check:erp-domain-layout",
  catalogExpectedCount: ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT,
  moduleScopeDefinitions: ERP_DOMAIN_MODULE_SCOPE_DEFINITIONS,
  externalRuntimeReferences: ERP_DOMAIN_EXTERNAL_RUNTIME_REFERENCES,
  catalogOnlyRule:
    "Catalog-only modules must not have a filesystem folder under erp-domain/ until promoted via B79+ slice.",
} as const;
