/**
 * PAS-001 §5 — kernel prohibited ownership registry.
 *
 * Authority-only metadata: documents what the kernel must never own and which
 * package or layer owns each concern. No runtime enforcement of domain behavior.
 */

export const KERNEL_PROHIBITED_OWNERSHIP_CATEGORIES = [
  "persistence",
  "auth",
  "authorization",
  "transport",
  "presentation",
  "domain-platform",
  "integration",
  "execution-runtime",
  "finance-accounting",
  "domain-modules",
  "localization-formatting",
] as const;

export type KernelProhibitedOwnershipCategory =
  (typeof KERNEL_PROHIBITED_OWNERSHIP_CATEGORIES)[number];

export const KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS = [
  "database-schema",
  "database-migrations",
  "database-clients",
  "rls-sql-policies",
  "auth-sessions",
  "auth-cookies",
  "auth-providers",
  "permission-evaluation",
  "feature-flag-evaluation",
  "entitlement-evaluation",
  "api-route-handlers",
  "server-actions",
  "react-components",
  "ui-primitives",
  "app-shell-navigation-behavior",
  "domain-workflows",
  "business-services",
  "integration-sdks",
  "external-api-clients",
  "cron-jobs",
  "queue-workers",
  "outbox-publishing",
  "fiscal-calendar-setup",
  "fiscal-period-close-workflow",
  "functional-currency-decisions",
  "reporting-currency-decisions",
  "currency-conversion",
  "accounting-posting",
  "ledger-calculation",
  "consolidation-elimination",
  "inventory-stock-movement-logic",
  "hrm-payroll-logic",
  "crm-pipeline-logic",
  "procurement-approval-logic",
  "translation-files",
  "date-number-formatting-implementation",
  "country-statutory-rules",
  "uom-conversion-rules",
] as const;

export type KernelProhibitedOwnershipConcernId =
  (typeof KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS)[number];

export interface KernelProhibitedOwnershipConcern {
  readonly category: KernelProhibitedOwnershipCategory;
  readonly id: KernelProhibitedOwnershipConcernId;
  readonly label: string;
  readonly owner: string;
}

export const KERNEL_PROHIBITED_OWNERSHIP_CONCERNS = {
  "database-schema": {
    id: "database-schema",
    label: "Database schema",
    category: "persistence",
    owner: "@afenda/database",
  },
  "database-migrations": {
    id: "database-migrations",
    label: "Database migrations",
    category: "persistence",
    owner: "@afenda/database",
  },
  "database-clients": {
    id: "database-clients",
    label: "Database clients",
    category: "persistence",
    owner: "@afenda/database",
  },
  "rls-sql-policies": {
    id: "rls-sql-policies",
    label: "RLS SQL policies",
    category: "persistence",
    owner: "@afenda/database",
  },
  "auth-sessions": {
    id: "auth-sessions",
    label: "Auth sessions",
    category: "auth",
    owner: "@afenda/auth",
  },
  "auth-cookies": {
    id: "auth-cookies",
    label: "Auth cookies",
    category: "auth",
    owner: "@afenda/auth",
  },
  "auth-providers": {
    id: "auth-providers",
    label: "Auth providers",
    category: "auth",
    owner: "@afenda/auth",
  },
  "permission-evaluation": {
    id: "permission-evaluation",
    label: "Permission evaluation",
    category: "authorization",
    owner: "@afenda/permissions",
  },
  "feature-flag-evaluation": {
    id: "feature-flag-evaluation",
    label: "Feature flag evaluation",
    category: "authorization",
    owner: "apps/erp",
  },
  "entitlement-evaluation": {
    id: "entitlement-evaluation",
    label: "Entitlement evaluation",
    category: "authorization",
    owner: "@afenda/entitlements",
  },
  "api-route-handlers": {
    id: "api-route-handlers",
    label: "API route handlers",
    category: "transport",
    owner: "apps/erp",
  },
  "server-actions": {
    id: "server-actions",
    label: "Server actions",
    category: "transport",
    owner: "apps/erp",
  },
  "react-components": {
    id: "react-components",
    label: "React components",
    category: "presentation",
    owner: "apps/erp",
  },
  "ui-primitives": {
    id: "ui-primitives",
    label: "UI primitives",
    category: "presentation",
    owner: "@afenda/ui",
  },
  "app-shell-navigation-behavior": {
    id: "app-shell-navigation-behavior",
    label: "App shell navigation behavior",
    category: "presentation",
    owner: "@afenda/appshell",
  },
  "domain-workflows": {
    id: "domain-workflows",
    label: "Domain workflows",
    category: "domain-platform",
    owner: "domain packages",
  },
  "business-services": {
    id: "business-services",
    label: "Business services",
    category: "domain-platform",
    owner: "domain packages",
  },
  "integration-sdks": {
    id: "integration-sdks",
    label: "Integration SDKs",
    category: "integration",
    owner: "integration packages",
  },
  "external-api-clients": {
    id: "external-api-clients",
    label: "External API clients",
    category: "integration",
    owner: "integration packages",
  },
  "cron-jobs": {
    id: "cron-jobs",
    label: "Cron jobs",
    category: "execution-runtime",
    owner: "@afenda/execution",
  },
  "queue-workers": {
    id: "queue-workers",
    label: "Queue workers",
    category: "execution-runtime",
    owner: "@afenda/execution",
  },
  "outbox-publishing": {
    id: "outbox-publishing",
    label: "Outbox publishing",
    category: "execution-runtime",
    owner: "@afenda/execution",
  },
  "fiscal-calendar-setup": {
    id: "fiscal-calendar-setup",
    label: "Fiscal calendar setup",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "fiscal-period-close-workflow": {
    id: "fiscal-period-close-workflow",
    label: "Fiscal period close workflow",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "functional-currency-decisions": {
    id: "functional-currency-decisions",
    label: "Functional currency decisions",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "reporting-currency-decisions": {
    id: "reporting-currency-decisions",
    label: "Reporting currency decisions",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "currency-conversion": {
    id: "currency-conversion",
    label: "Currency conversion",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "accounting-posting": {
    id: "accounting-posting",
    label: "Accounting posting",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "ledger-calculation": {
    id: "ledger-calculation",
    label: "Ledger calculation",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "consolidation-elimination": {
    id: "consolidation-elimination",
    label: "Consolidation elimination",
    category: "finance-accounting",
    owner: "@afenda/accounting",
  },
  "inventory-stock-movement-logic": {
    id: "inventory-stock-movement-logic",
    label: "Inventory stock movement logic",
    category: "domain-modules",
    owner: "inventory domain packages",
  },
  "hrm-payroll-logic": {
    id: "hrm-payroll-logic",
    label: "HRM payroll logic",
    category: "domain-modules",
    owner: "hrm domain packages",
  },
  "crm-pipeline-logic": {
    id: "crm-pipeline-logic",
    label: "CRM pipeline logic",
    category: "domain-modules",
    owner: "crm domain packages",
  },
  "procurement-approval-logic": {
    id: "procurement-approval-logic",
    label: "Procurement approval logic",
    category: "domain-modules",
    owner: "procurement domain packages",
  },
  "translation-files": {
    id: "translation-files",
    label: "Translation files",
    category: "localization-formatting",
    owner: "apps/docs + apps/erp i18n",
  },
  "date-number-formatting-implementation": {
    id: "date-number-formatting-implementation",
    label: "Date/number formatting implementation",
    category: "localization-formatting",
    owner: "apps/erp rendering layer",
  },
  "country-statutory-rules": {
    id: "country-statutory-rules",
    label: "Country statutory rules",
    category: "localization-formatting",
    owner: "domain statutory packages",
  },
  "uom-conversion-rules": {
    id: "uom-conversion-rules",
    label: "UOM conversion rules",
    category: "localization-formatting",
    owner: "inventory/product domain packages",
  },
} satisfies Record<
  KernelProhibitedOwnershipConcernId,
  KernelProhibitedOwnershipConcern
>;

export const KERNEL_PROHIBITED_OWNERSHIP_POLICY = {
  pasSection: "5",
  concernCount: KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS.length,
  categories: KERNEL_PROHIBITED_OWNERSHIP_CATEGORIES,
  constitutionalRule:
    "Kernel defines cross-package vocabulary and wire-safe contracts only. Persistence, auth runtime, permission evaluation, transport handlers, UI, domain workflows, execution jobs, and accounting runtime belong elsewhere.",
} as const;

const CONCERN_ID_SET = new Set<string>(KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS);

export function isKernelProhibitedOwnershipConcernId(
  value: string
): value is KernelProhibitedOwnershipConcernId {
  return CONCERN_ID_SET.has(value);
}

export function getKernelProhibitedOwnershipConcern(
  id: KernelProhibitedOwnershipConcernId
): KernelProhibitedOwnershipConcern {
  return KERNEL_PROHIBITED_OWNERSHIP_CONCERNS[id];
}

export function listKernelProhibitedOwnershipConcerns(): readonly KernelProhibitedOwnershipConcern[] {
  return KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS.map(
    (id) => KERNEL_PROHIBITED_OWNERSHIP_CONCERNS[id]
  );
}
