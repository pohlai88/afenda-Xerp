/**
 * Canonical Do's and Prohibitions registry — aligned with
 * `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md` (lines 447–480).
 *
 * Glossary vocabulary authority: `multi-tenancy-glossary-first-registry.mts` (Step 1 §484–500).
 * Runtime scans live in `lib/multi-tenancy-dos-prohibitions-enforcement.mts`.
 */
export const MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE =
  "multi-tenancy-dos-prohibitions-are-enforced-by-governance-gate-and-delegated-surface-gates" as const;

/** Markers that must appear in multi-tenancy.md §447–480. */
export const MULTI_TENANCY_DOC_DOS_MARKERS = [
  "Do create/update glossary first.",
  "Do separate Tenant, Entity Group, Legal Entity, Organization Unit, Team, Project.",
  "Do model ownership interest explicitly.",
  "Do prepare consolidation scope without implementing accounting.",
  "Do keep tenant subdomain as tenant resolver only.",
  "Do verify selected legal entity server-side.",
  "Do verify organization unit belongs to legal entity.",
  "Do verify grant scope.",
  "Do fail closed.",
  "Do preserve CSP nonce pipeline.",
  "Do preserve RBAC.",
  "Do preserve correlation ID.",
  "Do add tests.",
  "Do produce delivery evidence.",
  "Do run full quality gates.",
] as const;

export const MULTI_TENANCY_DOC_PROHIBITIONS_MARKERS = [
  "Do not call legal entity",
  "Do not use organization as replacement for company.",
  "Do not treat tenant as company.",
  "Do not treat tenant admin as automatic all-company access unless explicitly governed.",
  "Do not allow sibling company access without explicit grant.",
  "Do not trust client-provided company/legalEntity/entityGroup/org IDs.",
  "Do not implement accounting journals, ledgers, reports, or consolidation entries.",
  "Do not start Foundation phase 13.",
  "Do not add business modules.",
  "Do not weaken RLS/RBAC/CSP.",
  "Do not use `any`.",
  "Do not deep import.",
  "Do not silence architecture checks.",
  "Do not leave TODOs as completion.",
] as const;

export {
  MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES,
  MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE,
  MULTI_TENANCY_GLOSSARY_PATH,
  MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS,
} from "./multi-tenancy-glossary-first-registry.mts";

/**
 * Do's mapped to delegated governance gates (enforcement is authoritative in
 * the referenced gate; this registry documents ownership only).
 */
export const MULTI_TENANCY_DOS_DELEGATED_GATES = [
  {
    id: "glossary-first",
    marker: "Do create/update glossary first.",
    checkScript: "check:multi-tenancy-glossary-first",
  },
  {
    id: "separate-tiers",
    marker:
      "Do separate Tenant, Entity Group, Legal Entity, Organization Unit, Team, Project.",
    checkScript: "check:database-tenant-domain-surface",
  },
  {
    id: "ownership-interest",
    marker: "Do model ownership interest explicitly.",
    checkScript: "check:database-tenant-domain-surface",
  },
  {
    id: "consolidation-scope-without-accounting",
    marker: "Do prepare consolidation scope without implementing accounting.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
  },
  {
    id: "tenant-subdomain-resolver-only",
    marker: "Do keep tenant subdomain as tenant resolver only.",
    checkScript: "check:erp-context-surface",
  },
  {
    id: "verify-legal-entity-server-side",
    marker: "Do verify selected legal entity server-side.",
    checkScript: "check:erp-context-surface",
  },
  {
    id: "verify-org-belongs-to-legal-entity",
    marker: "Do verify organization unit belongs to legal entity.",
    checkScript: "check:erp-context-surface",
  },
  {
    id: "verify-grant-scope",
    marker: "Do verify grant scope.",
    checkScript: "check:permissions-scope-grants-surface",
  },
  {
    id: "fail-closed",
    marker: "Do fail closed.",
    checkScript: "check:permissions-scope-grants-surface",
  },
  {
    id: "preserve-csp-nonce",
    marker: "Do preserve CSP nonce pipeline.",
    checkScript: "check:csp-third-party",
  },
  {
    id: "preserve-rbac",
    marker: "Do preserve RBAC.",
    checkScript: "check:permissions-scope-grants-surface",
  },
  {
    id: "preserve-correlation-id",
    marker: "Do preserve correlation ID.",
    checkScript: "check:observability-surface",
  },
  {
    id: "add-tests",
    marker: "Do add tests.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
  },
  {
    id: "delivery-evidence",
    marker: "Do produce delivery evidence.",
    checkScript: "check:delivery-evidence-surface",
  },
  {
    id: "full-quality-gates",
    marker: "Do run full quality gates.",
    checkScript: "check:delivery-evidence-surface",
  },
] as const;

/**
 * Prohibitions with primary enforcement gate or scan rule id.
 */
export const MULTI_TENANCY_PROHIBITION_ENFORCEMENT = [
  {
    id: "legal-entity-not-organization",
    marker: "Do not call legal entity",
    checkScript: "check:multi-tenancy-glossary-first",
    scanRule: "glossary-do-not-confuse",
  },
  {
    id: "organization-not-company-replacement",
    marker: "Do not use organization as replacement for company.",
    checkScript: "check:multi-tenancy-glossary-first",
    scanRule: "glossary-do-not-confuse",
  },
  {
    id: "tenant-not-company",
    marker: "Do not treat tenant as company.",
    checkScript: "check:multi-tenancy-glossary-first",
    scanRule: "glossary-do-not-confuse",
  },
  {
    id: "tenant-admin-not-all-company",
    marker:
      "Do not treat tenant admin as automatic all-company access unless explicitly governed.",
    checkScript: "check:permissions-scope-grants-surface",
    scanRule: "delegated-gate",
  },
  {
    id: "no-sibling-company-without-grant",
    marker: "Do not allow sibling company access without explicit grant.",
    checkScript: "check:permissions-scope-grants-surface",
    scanRule: "delegated-gate",
  },
  {
    id: "no-trust-client-authority-ids",
    marker:
      "Do not trust client-provided company/legalEntity/entityGroup/org IDs.",
    checkScript: "check:erp-context-surface",
    scanRule: "delegated-gate",
  },
  {
    id: "no-accounting-implementation",
    marker:
      "Do not implement accounting journals, ledgers, reports, or consolidation entries.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
    scanRule: "forbidden-accounting-pattern",
  },
  {
    id: "no-tip-013",
    marker: "Do not start Foundation phase 13.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
    scanRule: "forbidden-accounting-pattern",
  },
  {
    id: "no-business-modules",
    marker: "Do not add business modules.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
    scanRule: "forbidden-business-module-path",
  },
  {
    id: "no-weaken-rls-rbac-csp",
    marker: "Do not weaken RLS/RBAC/CSP.",
    checkScript: "check:csp-third-party",
    scanRule: "delegated-gate",
  },
  {
    id: "no-any",
    marker: "Do not use `any`.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
    scanRule: "forbidden-any-type",
  },
  {
    id: "no-deep-import",
    marker: "Do not deep import.",
    checkScript: "check:multi-tenancy-dependency-rules",
    scanRule: "delegated-gate",
  },
  {
    id: "no-silence-architecture-checks",
    marker: "Do not silence architecture checks.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
    scanRule: "architecture-check-silence",
  },
  {
    id: "no-todo-as-completion",
    marker: "Do not leave TODOs as completion.",
    checkScript: "check:multi-tenancy-dos-prohibitions",
    scanRule: "todo-as-completion",
  },
] as const;

/** Relative repo paths scanned for forbidden `: any` / `as any`. */
export const MULTI_TENANCY_FORBIDDEN_ANY_SCAN_ROOTS = [
  "apps/erp/src/lib/context",
  "apps/erp/src/lib/api",
  "apps/erp/src/server/api",
  "apps/erp/src/lib/server-actions",
  "packages/kernel/src/context",
  "packages/database/src/tenant-domain",
  "packages/database/src/entity-group",
  "packages/database/src/ownership-interest",
  "packages/database/src/grant-scope",
  "packages/database/src/legal-entity",
  "packages/database/src/organization-unit",
  "packages/permissions/src",
  "packages/appshell/src",
  "packages/observability/src",
] as const;

/** Directory segments excluded from accounting prohibition scans. */
export const MULTI_TENANCY_ACCOUNTING_SCAN_EXCLUDED_SEGMENTS = [
  "__tests__",
  "migrations",
  "node_modules",
] as const;

/**
 * Documented risk mitigations for §447–480 enforcement (delivery evidence sync).
 * Each entry maps to a scan rule or delegated gate.
 */
export const MULTI_TENANCY_DOS_PROHIBITIONS_RISK_MITIGATIONS = [
  {
    risk: "False-positive accounting scan",
    mitigation:
      "Code-only scan (strip comments/strings); exclude __tests__, migrations, (dev) routes",
    scanRule: "forbidden-accounting-pattern",
    residual: "low",
  },
  {
    risk: ": any in authority surfaces",
    mitigation:
      "Code-only scan across 14 multi-tenancy authority roots (kernel, database tenant-domain, ERP context/API, permissions, appshell, observability)",
    scanRule: "forbidden-any-type",
    residual: "low",
  },
  {
    risk: "Prohibition table vs overclaim guard",
    mitigation:
      "Delivery-evidence overclaim patterns skip lines starting with Do not",
    scanRule: "tip-follow-on-overclaim",
    residual: "low",
  },
  {
    risk: "Gate ordering drift",
    mitigation:
      "check-multi-tenancy-dos-prohibitions verifies quality chain runs before delivery-evidence",
    scanRule: "quality-chain-order",
    residual: "low",
  },
  {
    risk: "Glossary tier conflation",
    mitigation:
      "Step 1 glossary-first gate: 11 terms, per-section do-not-confuse notes, cross-term phrases (check:multi-tenancy-glossary-first)",
    scanRule: "glossary-do-not-confuse",
    residual: "low",
  },
] as const;

/** Relative repo paths scanned for session tenantId anti-pattern. */
export const MULTI_TENANCY_SESSION_TENANT_ID_SCAN_ROOTS = [
  "apps/erp/src",
  "packages/kernel/src/context",
  "packages/permissions/src",
] as const;

export const MULTI_TENANCY_SESSION_TENANT_ID_PATTERN =
  /session\.user\.tenantId\b/;

/** ERP production scan roots for accounting / Foundation phase 13 prohibition. */
export const MULTI_TENANCY_ACCOUNTING_SCAN_ROOTS = [
  "apps/erp/src/lib/context",
  "apps/erp/src/server",
  "apps/erp/src/lib/server-actions",
  "apps/erp/src/app/(protected)",
] as const;

export const MULTI_TENANCY_FORBIDDEN_ACCOUNTING_PATTERNS = [
  /journal\.post/i,
  /insertJournal/i,
  /postJournal/i,
  /\bgeneral_ledger\b/i,
  /consolidationElimination/i,
  /consolidation_entries/i,
  /chart_of_accounts/i,
  /\bTIP-013\b/,
  /tip-013/i,
] as const;

/** Protected app route segments that must not exist before Foundation phase 13. */
export const MULTI_TENANCY_FORBIDDEN_BUSINESS_MODULE_SEGMENTS = [
  "accounting",
  "inventory",
  "hrm",
  "payroll",
  "manufacturing",
  "procurement",
] as const;

/** Governance test directory — Do add tests. */
export const MULTI_TENANCY_GOVERNANCE_TEST_ROOT =
  "scripts/governance/__tests__" as const;

export const MULTI_TENANCY_DOS_PROHIBITIONS_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-dos-prohibitions-enforcement.mts" as const;

export const MULTI_TENANCY_DOS_PROHIBITIONS_GATE =
  "scripts/governance/check-multi-tenancy-dos-prohibitions.mts" as const;

/** Delivery doc section title for §447–480 mapping. */
export const MULTI_TENANCY_DOS_PROHIBITIONS_SECTION =
  "Do's and Prohibitions enforcement" as const;
