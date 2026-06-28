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
 */
export const ERP_DOMAIN_EXTERNAL_RUNTIME_REFERENCES = {
  inventory: "PKGR02_INVENTORY",
} as const satisfies Partial<Record<ErpDomainModule, string>>;

/** Expected full-suite catalog size — must match PAS-001B §3 table row count. */
export const ERP_DOMAIN_PAS_CATALOG_EXPECTED_COUNT = 28 as const;

export const ERP_DOMAIN_MODULE_MATURITY = {
  accounting: "delivered",
  controlling: "catalog-only",
  treasury: "catalog-only",
  tax: "catalog-only",
  consolidation: "catalog-only",
  intercompany: "catalog-only",
  procurement: "catalog-only",
  inventory: "catalog-only",
  manufacturing: "catalog-only",
  quality: "catalog-only",
  maintenance: "catalog-only",
  "supply-chain": "catalog-only",
  sales: "catalog-only",
  crm: "catalog-only",
  pricing: "catalog-only",
  subscription: "catalog-only",
  ecommerce: "catalog-only",
  pos: "catalog-only",
  service: "catalog-only",
  "field-service": "catalog-only",
  marketing: "catalog-only",
  hcm: "catalog-only",
  payroll: "catalog-only",
  project: "catalog-only",
  assets: "catalog-only",
  document: "catalog-only",
  workflow: "catalog-only",
  analytics: "catalog-only",
} as const satisfies Record<ErpDomainModule, ErpDomainModuleMaturity>;

export const ERP_DOMAIN_MODULE_METADATA = {
  accounting: {
    lobPillar: "finance",
    sapAnchor: "FI",
    oracleAnchor: "Financials",
    odooAnchor: "Accounting",
    runtimeOwnerPackage: "PKGR01_ACCOUNTING",
    vocabularyGate: "pnpm check:accounting-domain-contracts",
  },
  controlling: {
    lobPillar: "finance",
    sapAnchor: "CO",
    oracleAnchor: "EPM",
    odooAnchor: "Analytic",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  treasury: {
    lobPillar: "finance",
    sapAnchor: "TR",
    oracleAnchor: "Cash Management",
    odooAnchor: "—",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  tax: {
    lobPillar: "finance",
    sapAnchor: "Tax",
    oracleAnchor: "Indirect Tax",
    odooAnchor: "Taxes",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  consolidation: {
    lobPillar: "finance",
    sapAnchor: "Group Reporting",
    oracleAnchor: "FCCS",
    odooAnchor: "Consolidation",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  intercompany: {
    lobPillar: "finance",
    sapAnchor: "IC",
    oracleAnchor: "Intercompany",
    odooAnchor: "—",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  procurement: {
    lobPillar: "scm",
    sapAnchor: "MM-PUR",
    oracleAnchor: "Procurement",
    odooAnchor: "Purchase",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  inventory: {
    lobPillar: "scm",
    sapAnchor: "MM-IM",
    oracleAnchor: "Inventory",
    odooAnchor: "Inventory",
    runtimeOwnerPackage: "PKGR02_INVENTORY",
    vocabularyGate: null,
  },
  manufacturing: {
    lobPillar: "scm",
    sapAnchor: "PP",
    oracleAnchor: "Manufacturing",
    odooAnchor: "MRP",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  quality: {
    lobPillar: "scm",
    sapAnchor: "QM",
    oracleAnchor: "Quality",
    odooAnchor: "Quality",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  maintenance: {
    lobPillar: "scm",
    sapAnchor: "PM",
    oracleAnchor: "Maintenance",
    odooAnchor: "Maintenance",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  "supply-chain": {
    lobPillar: "scm",
    sapAnchor: "LE-WM",
    oracleAnchor: "Logistics",
    odooAnchor: "Delivery",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  sales: {
    lobPillar: "sales-cx",
    sapAnchor: "SD",
    oracleAnchor: "Order Management",
    odooAnchor: "Sales",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  crm: {
    lobPillar: "sales-cx",
    sapAnchor: "CRM",
    oracleAnchor: "Sales Cloud",
    odooAnchor: "CRM",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  pricing: {
    lobPillar: "sales-cx",
    sapAnchor: "SD-Pricing",
    oracleAnchor: "Pricing",
    odooAnchor: "Pricelists",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  subscription: {
    lobPillar: "sales-cx",
    sapAnchor: "BRIM",
    oracleAnchor: "Subscription",
    odooAnchor: "Subscriptions",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  ecommerce: {
    lobPillar: "sales-cx",
    sapAnchor: "—",
    oracleAnchor: "—",
    odooAnchor: "eCommerce",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  pos: {
    lobPillar: "sales-cx",
    sapAnchor: "—",
    oracleAnchor: "—",
    odooAnchor: "POS",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  service: {
    lobPillar: "service",
    sapAnchor: "CS",
    oracleAnchor: "Service Cloud",
    odooAnchor: "Helpdesk",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  "field-service": {
    lobPillar: "service",
    sapAnchor: "—",
    oracleAnchor: "Field Service",
    odooAnchor: "Field Service",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  marketing: {
    lobPillar: "marketing",
    sapAnchor: "—",
    oracleAnchor: "Marketing Cloud",
    odooAnchor: "Marketing",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  hcm: {
    lobPillar: "hcm-projects",
    sapAnchor: "HCM",
    oracleAnchor: "Core HR",
    odooAnchor: "Employees",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  payroll: {
    lobPillar: "hcm-projects",
    sapAnchor: "PY",
    oracleAnchor: "Payroll",
    odooAnchor: "Payroll",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  project: {
    lobPillar: "hcm-projects",
    sapAnchor: "PS",
    oracleAnchor: "PPM",
    odooAnchor: "Project",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  assets: {
    lobPillar: "hcm-projects",
    sapAnchor: "AA",
    oracleAnchor: "Fixed Assets",
    odooAnchor: "Assets",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  document: {
    lobPillar: "platform-erp",
    sapAnchor: "DMS",
    oracleAnchor: "Documents",
    odooAnchor: "Documents",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  workflow: {
    lobPillar: "platform-erp",
    sapAnchor: "WF",
    oracleAnchor: "Approvals",
    odooAnchor: "Approvals",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
  analytics: {
    lobPillar: "platform-erp",
    sapAnchor: "BW",
    oracleAnchor: "OTBI",
    odooAnchor: "Spreadsheet",
    runtimeOwnerPackage: null,
    vocabularyGate: null,
  },
} as const satisfies Record<ErpDomainModule, ErpDomainModuleMetadata>;

/** Repo-relative paths to each delivered domain public barrel (`index.ts`). */
export const ERP_DOMAIN_MODULE_INDEX_PATHS = {
  accounting: "packages/kernel/src/erp-domain/accounting/index.ts",
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
