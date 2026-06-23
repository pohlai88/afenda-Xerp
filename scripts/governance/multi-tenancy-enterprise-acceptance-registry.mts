/**
 * Canonical enterprise acceptance criteria registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§612–666).
 */
import { TIP_007_012_DELIVERY_DOC } from "./delivery-evidence-surface-registry.mts";

export const MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SURFACE_RULE =
  "multi-tenancy-enterprise-acceptance-is-canonical-slice-completion-matrix" as const;

export type EnterpriseAcceptanceCategory =
  | "glossary"
  | "functional"
  | "security-rls"
  | "accounting-readiness"
  | "architecture";

export interface EnterpriseAcceptanceCriterion {
  readonly id: string;
  readonly category: EnterpriseAcceptanceCategory;
  readonly requirement: string;
  readonly delegatedGates: readonly string[];
  readonly deliveryMarker: string;
  readonly testFiles?: readonly string[];
  readonly coverageMarkers?: readonly string[];
}

/** Markers that must appear in multi-tenancy.md (§612–666). */
export const MULTI_TENANCY_DOC_ENTERPRISE_ACCEPTANCE_MARKERS = [
  "Enterprise acceptance criteria:",
  "Glossary acceptance:",
  "Functional acceptance:",
  "Security/RLS acceptance:",
  "Accounting-readiness acceptance:",
  "Architecture acceptance:",
  "Consolidation scope is documented but not implemented as accounting logic",
  "Client-provided context IDs are treated as untrusted",
  "No TIP-013 started",
] as const;

/** Delivery doc H2 containing enterprise acceptance matrix. */
export const TIP_007_012_ENTERPRISE_ACCEPTANCE_SECTION =
  "Enterprise acceptance criteria checklist" as const;

export const MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS = [
  {
    id: "glossary",
    title: "Glossary acceptance",
    tableMarker: "### Glossary acceptance",
  },
  {
    id: "functional",
    title: "Functional acceptance",
    tableMarker: "### Functional acceptance",
  },
  {
    id: "security-rls",
    title: "Security/RLS acceptance",
    tableMarker: "### Security/RLS acceptance",
  },
  {
    id: "accounting-readiness",
    title: "Accounting-readiness acceptance",
    tableMarker: "### Accounting-readiness acceptance",
  },
  {
    id: "architecture",
    title: "Architecture acceptance",
    tableMarker: "### Architecture acceptance",
  },
] as const;

/** One row per bullet in multi-tenancy.md §614–665. */
export const MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA = [
  {
    id: "glossary-seven-terms-defined",
    category: "glossary",
    requirement:
      "Tenant, entity group, legal entity/company, ownership interest, organization unit, team, project are explicitly defined",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    deliveryMarker: "seven Step 1 glossary terms",
  },
  {
    id: "glossary-company-not-organization",
    category: "glossary",
    requirement: "Company/legal entity is not confused with organization",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    deliveryMarker: "not confused with organization",
  },
  {
    id: "glossary-tenant-not-company",
    category: "glossary",
    requirement: "Tenant is not confused with company",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    deliveryMarker: "Tenant is not confused with company",
  },
  {
    id: "glossary-org-not-statutory",
    category: "glossary",
    requirement: "Organization unit is not treated as statutory entity",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    deliveryMarker: "not treated as statutory entity",
  },
  {
    id: "glossary-consolidation-scope-authority-only",
    category: "glossary",
    requirement:
      "Consolidation scope is documented but not implemented as accounting logic",
    delegatedGates: [
      "check:multi-tenancy-authority-design",
      "check:delivery-evidence-surface",
    ],
    deliveryMarker: "not implemented as accounting logic",
  },
  {
    id: "functional-tenant-subdomain",
    category: "functional",
    requirement: "Tenant resolves from subdomain",
    delegatedGates: ["check:multi-tenancy-tenant-url-resolver"],
    deliveryMarker: "Tenant resolves from subdomain",
    testFiles: ["apps/erp/src/__tests__/tenant-domain.test.ts"],
    coverageMarkers: ["tenant slug"],
  },
  {
    id: "functional-subdomain-not-company",
    category: "functional",
    requirement: "Tenant subdomain does not imply company selection",
    delegatedGates: ["check:multi-tenancy-tenant-url-resolver"],
    deliveryMarker: "does not imply company selection",
    testFiles: ["apps/erp/src/__tests__/tenant-domain.test.ts"],
    coverageMarkers: ["rejects reserved subdomains"],
  },
  {
    id: "functional-entity-group-multiple-companies",
    category: "functional",
    requirement: "Entity group can contain multiple legal entities",
    delegatedGates: ["check:multi-tenancy-persistence-lookup"],
    deliveryMarker: "multiple legal entities",
    testFiles: [
      "apps/erp/src/__tests__/operating-context.resolution.contract.test.ts",
    ],
    coverageMarkers: ["entity group"],
  },
  {
    id: "functional-legal-entity-tenant-group",
    category: "functional",
    requirement: "Legal entity belongs to tenant/entity group",
    delegatedGates: ["check:multi-tenancy-persistence-lookup"],
    deliveryMarker: "belongs to tenant/entity group",
    testFiles: ["packages/database/src/__tests__/company.contract.test.ts"],
    coverageMarkers: ["tenantId"],
  },
  {
    id: "functional-ownership-interest-types",
    category: "functional",
    requirement:
      "Ownership interest can represent subsidiary, associate, joint venture, minority interest",
    delegatedGates: ["check:multi-tenancy-authority-design"],
    deliveryMarker: "subsidiary, associate, joint venture, minority interest",
    testFiles: [
      "packages/database/src/__tests__/ownership-interest.contract.test.ts",
    ],
    coverageMarkers: ["relationshipType", "controlType"],
  },
  {
    id: "functional-org-belongs-legal-entity",
    category: "functional",
    requirement: "Organization unit belongs to legal entity",
    delegatedGates: ["check:multi-tenancy-operating-context-resolver"],
    deliveryMarker: "Organization unit belongs to legal entity",
    testFiles: ["apps/erp/src/__tests__/operating-context.test.ts"],
    coverageMarkers: ["ORGANIZATION_SCOPE_MISMATCH"],
  },
  {
    id: "functional-actor-context-scope",
    category: "functional",
    requirement: "Actor context resolves to allowed legal entity/org scope",
    delegatedGates: ["check:multi-tenancy-operating-context-resolver"],
    deliveryMarker: "allowed legal entity/org scope",
    testFiles: [
      "apps/erp/src/lib/context/__tests__/resolve-legal-entity-context.test.ts",
    ],
    coverageMarkers: ["resolveLegalEntityContext"],
  },
  {
    id: "functional-appshell-displays-context",
    category: "functional",
    requirement:
      "AppShell displays resolved tenant/entity group/legal entity/org context",
    delegatedGates: ["check:appshell-context-surface"],
    deliveryMarker: "AppShell displays resolved",
  },
  {
    id: "functional-context-switch-server",
    category: "functional",
    requirement: "Context switch is validated server-side",
    delegatedGates: ["check:multi-tenancy-context-integration"],
    deliveryMarker: "Context switch is validated server-side",
    testFiles: ["apps/erp/src/lib/context/__tests__/context-switch.action.test.ts"],
    coverageMarkers: ["switchOperatingContextAction"],
  },
  {
    id: "security-tenant-boundary-fail-closed",
    category: "security-rls",
    requirement: "Tenant boundary fails closed",
    delegatedGates: ["check:multi-tenancy-operating-context-resolver"],
    deliveryMarker: "Tenant boundary fails closed",
    testFiles: ["apps/erp/src/__tests__/operating-context.test.ts"],
    coverageMarkers: ["TENANT_NOT_FOUND"],
  },
  {
    id: "security-legal-entity-boundary-fail-closed",
    category: "security-rls",
    requirement: "Legal entity boundary fails closed",
    delegatedGates: ["check:permissions-scope-grants-surface"],
    deliveryMarker: "Legal entity boundary fails closed",
    testFiles: ["packages/permissions/src/__tests__/authorization.test.ts"],
    coverageMarkers: ["company_mismatch"],
  },
  {
    id: "security-sibling-company-denied",
    category: "security-rls",
    requirement: "Sibling company access denied without explicit grant",
    delegatedGates: ["check:multi-tenancy-tests"],
    deliveryMarker: "Sibling company access denied",
    testFiles: ["packages/database/src/__tests__/rls-grant.contract.test.ts"],
    coverageMarkers: ["sibling"],
  },
  {
    id: "security-minority-interest-explicit",
    category: "security-rls",
    requirement: "Minority-interest entity access requires explicit grant",
    delegatedGates: ["check:multi-tenancy-tests"],
    deliveryMarker: "Minority-interest entity access requires explicit grant",
    testFiles: ["packages/database/src/__tests__/rls-grant.contract.test.ts"],
    coverageMarkers: ["minorityInterestCompany"],
  },
  {
    id: "security-cross-company-explicit",
    category: "security-rls",
    requirement: "Cross-company access requires explicit grant",
    delegatedGates: ["check:permissions-scope-grants-surface"],
    deliveryMarker: "Cross-company access requires explicit grant",
    testFiles: ["packages/permissions/src/__tests__/authorization.test.ts"],
    coverageMarkers: ["company_mismatch"],
  },
  {
    id: "security-consolidation-view-explicit",
    category: "security-rls",
    requirement: "Consolidation-view access requires explicit grant",
    delegatedGates: ["check:multi-tenancy-tests"],
    deliveryMarker: "Consolidation-view access requires explicit grant",
    testFiles: ["packages/database/src/__tests__/rls-grant.contract.test.ts"],
    coverageMarkers: ["consolidationView"],
  },
  {
    id: "security-untrusted-client-ids",
    category: "security-rls",
    requirement: "Client-provided context IDs are treated as untrusted",
    delegatedGates: ["check:multi-tenancy-context-integration"],
    deliveryMarker: "Client-provided context IDs are treated as untrusted",
    testFiles: ["apps/erp/src/__tests__/operating-context-integration.test.ts"],
    coverageMarkers: ["rejectUntrustedAuthorityFields"],
  },
  {
    id: "security-permission-resolved-scope",
    category: "security-rls",
    requirement: "Permission checks use resolved scope",
    delegatedGates: ["check:erp-context-surface"],
    deliveryMarker: "Permission checks use resolved scope",
    testFiles: ["apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts"],
    coverageMarkers: ["operatingContext"],
  },
  {
    id: "security-logs-no-secrets",
    category: "security-rls",
    requirement: "Logs do not leak secrets",
    delegatedGates: ["check:erp-observability"],
    deliveryMarker: "Logs do not leak secrets",
  },
  {
    id: "security-correlation-id",
    category: "security-rls",
    requirement: "Correlation ID is preserved",
    delegatedGates: ["check:observability-surface"],
    deliveryMarker: "Correlation ID is preserved",
    testFiles: ["apps/erp/src/__tests__/correlation-middleware.test.ts"],
    coverageMarkers: ["x-correlation-id"],
  },
  {
    id: "accounting-entity-group-consolidation-root",
    category: "accounting-readiness",
    requirement: "Entity group exists as future consolidation root",
    delegatedGates: ["check:multi-tenancy-authority-design"],
    deliveryMarker: "future consolidation root",
  },
  {
    id: "accounting-legal-entity-identity",
    category: "accounting-readiness",
    requirement: "Legal entity/company has accounting-ready identity fields",
    delegatedGates: ["check:database-tenant-domain-surface"],
    deliveryMarker: "accounting-ready identity fields",
    testFiles: ["packages/database/src/__tests__/company.contract.test.ts"],
    coverageMarkers: ["baseCurrency"],
  },
  {
    id: "accounting-ownership-interest-fields",
    category: "accounting-readiness",
    requirement:
      "Ownership interest supports percentage, control type, consolidation treatment, and effective dates",
    delegatedGates: ["check:multi-tenancy-authority-design"],
    deliveryMarker: "consolidation treatment, and effective dates",
    testFiles: [
      "packages/database/src/__tests__/ownership-interest.contract.test.ts",
    ],
    coverageMarkers: ["consolidationMethod", "effectiveFrom"],
  },
  {
    id: "accounting-consolidation-scope-contract-only",
    category: "accounting-readiness",
    requirement: "Consolidation scope is prepared as context/contract only",
    delegatedGates: ["check:kernel-context-surface"],
    deliveryMarker: "context/contract only",
    testFiles: ["packages/kernel/src/__tests__/context-registry.test.ts"],
    coverageMarkers: ["consolidationScope"],
  },
  {
    id: "accounting-no-journal-logic",
    category: "accounting-readiness",
    requirement:
      "No accounting journal/ledger/consolidation business logic is implemented",
    delegatedGates: ["check:multi-tenancy-dos-prohibitions"],
    deliveryMarker: "No accounting journal/ledger/consolidation business logic",
  },
  {
    id: "architecture-kernel-contracts",
    category: "architecture",
    requirement: "Kernel owns contracts",
    delegatedGates: ["check:kernel-context-surface"],
    deliveryMarker: "Kernel owns contracts",
  },
  {
    id: "architecture-database-persistence",
    category: "architecture",
    requirement: "Database owns persistence",
    delegatedGates: ["check:database-tenant-domain-surface"],
    deliveryMarker: "Database owns persistence",
  },
  {
    id: "architecture-erp-integration",
    category: "architecture",
    requirement: "ERP app owns Next.js integration",
    delegatedGates: ["check:erp-context-surface"],
    deliveryMarker: "ERP app owns Next.js integration",
  },
  {
    id: "architecture-permissions-grants",
    category: "architecture",
    requirement: "Permissions owns grants/checks",
    delegatedGates: ["check:permissions-scope-grants-surface"],
    deliveryMarker: "Permissions owns grants/checks",
  },
  {
    id: "architecture-appshell-consumes",
    category: "architecture",
    requirement: "AppShell consumes context",
    delegatedGates: ["check:appshell-context-surface"],
    deliveryMarker: "AppShell consumes context",
  },
  {
    id: "architecture-no-deep-imports",
    category: "architecture",
    requirement: "No deep imports",
    delegatedGates: ["check:multi-tenancy-dependency-rules"],
    deliveryMarker: "No deep imports",
  },
  {
    id: "architecture-no-unapproved-dependency",
    category: "architecture",
    requirement: "No unapproved dependency",
    delegatedGates: ["check:architecture-authority-surface"],
    deliveryMarker: "No unapproved dependency",
  },
  {
    id: "architecture-no-business-domain",
    category: "architecture",
    requirement: "No business domain created",
    delegatedGates: ["check:multi-tenancy-dos-prohibitions"],
    deliveryMarker: "No business domain created",
  },
  {
    id: "architecture-no-tip-013",
    category: "architecture",
    requirement: "No TIP-013 started",
    delegatedGates: ["check:multi-tenancy-dos-prohibitions"],
    deliveryMarker: "No TIP-013 started",
  },
] as const satisfies readonly EnterpriseAcceptanceCriterion[];

export const MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_GATE =
  "scripts/governance/check-multi-tenancy-enterprise-acceptance.mts" as const;

export const MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-enterprise-acceptance-enforcement.mts" as const;
