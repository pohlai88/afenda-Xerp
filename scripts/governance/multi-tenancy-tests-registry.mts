/**
 * Canonical Step 9 multi-tenancy test coverage registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 9, lines 580–599).
 *
 * Repo uses contract/governance assertion tests — not Vitest snapshots.
 */
export const MULTI_TENANCY_TESTS_SURFACE_RULE =
  "multi-tenancy-tests-is-canonical-step-9-coverage-matrix" as const;

/** Markers that must appear in multi-tenancy.md Step 9 (§580–599). */
export const MULTI_TENANCY_DOC_TESTS_MARKERS = [
  "Step 9 — Tests",
  "tenant slug parsing",
  "reserved subdomain rejection",
  "unknown tenant rejection",
  "entity group resolution",
  "legal entity resolution",
  "ownership interest validation",
  "legal entity sibling access denied",
  "minority-interest access requires explicit grant",
  "organization unit must belong to selected legal entity",
  "tenant admin does not automatically grant all-company access unless explicitly governed",
  "consolidation-view grant is explicit",
  "client-provided legalEntityId spoofing rejected",
  "API route uses resolved operating context",
  "server action uses resolved operating context",
  "AppShell context switch validates server-side",
  "CSP/RBAC/correlation regression",
] as const;

/** Delivery doc H2 — must match `MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS` entry. */
export const MULTI_TENANCY_TESTS_SECTION = "Tests added or updated" as const;

/** Step 9 test matrix — one row per multi-tenancy.md bullet (§583–599). */
export const MULTI_TENANCY_TEST_REQUIREMENTS = [
  {
    id: "glossary-contract-assertions",
    requirement: "glossary/contract snapshots if repo supports",
    testFiles: [
      "scripts/governance/__tests__/check-multi-tenancy-glossary-first.test.ts",
      "scripts/governance/__tests__/check-multi-tenancy-context-contracts.test.ts",
      "packages/kernel/src/__tests__/context-registry.test.ts",
    ],
    coverageMarkers: ["glossary", "context contract"],
  },
  {
    id: "tenant-slug-parsing",
    requirement: "tenant slug parsing",
    testFiles: [
      "apps/erp/src/__tests__/tenant-domain.test.ts",
      "packages/database/src/__tests__/tenant.contract.test.ts",
    ],
    coverageMarkers: ["tenant slug", "normalizes tenant slugs"],
  },
  {
    id: "reserved-subdomain-rejection",
    requirement: "reserved subdomain rejection",
    testFiles: ["apps/erp/src/__tests__/tenant-domain.test.ts"],
    coverageMarkers: ["rejects reserved subdomains"],
  },
  {
    id: "unknown-tenant-rejection",
    requirement: "unknown tenant rejection",
    testFiles: ["apps/erp/src/__tests__/operating-context.test.ts"],
    coverageMarkers: ["rejects unknown tenant"],
  },
  {
    id: "entity-group-resolution",
    requirement: "entity group resolution",
    testFiles: [
      "apps/erp/src/__tests__/operating-context.resolution.contract.test.ts",
      "apps/erp/src/__tests__/operating-context.test.ts",
    ],
    coverageMarkers: [
      "accepts operational entity group within tenant boundary",
      "entity group",
    ],
  },
  {
    id: "legal-entity-resolution",
    requirement: "legal entity resolution",
    testFiles: [
      "apps/erp/src/lib/context/__tests__/resolve-legal-entity-context.test.ts",
      "apps/erp/src/__tests__/operating-context.test.ts",
    ],
    coverageMarkers: ["resolves legal entity", "legal entity"],
  },
  {
    id: "ownership-interest-validation",
    requirement: "ownership interest validation",
    testFiles: [
      "packages/database/src/__tests__/ownership-interest.contract.test.ts",
      "packages/kernel/src/__tests__/context-registry.test.ts",
    ],
    coverageMarkers: ["ownership interest", "ownershipInterest"],
  },
  {
    id: "legal-entity-sibling-access-denied",
    requirement: "legal entity sibling access denied",
    testFiles: [
      "packages/database/src/__tests__/rls-grant.contract.test.ts",
      "packages/permissions/src/__tests__/authorization.test.ts",
    ],
    coverageMarkers: ["sibling", "company_mismatch"],
  },
  {
    id: "minority-interest-explicit-grant",
    requirement: "minority-interest access requires explicit grant",
    testFiles: ["packages/database/src/__tests__/rls-grant.contract.test.ts"],
    coverageMarkers: ["minority-interest", "minorityInterestCompany"],
  },
  {
    id: "organization-unit-belongs-to-legal-entity",
    requirement: "organization unit must belong to selected legal entity",
    testFiles: ["apps/erp/src/__tests__/operating-context.test.ts"],
    coverageMarkers: ["organization unit outside selected legal entity"],
  },
  {
    id: "tenant-admin-no-implicit-company-access",
    requirement:
      "tenant admin does not automatically grant all-company access unless explicitly governed",
    testFiles: ["packages/permissions/src/__tests__/authorization.test.ts"],
    coverageMarkers: ["denies tenant-scoped grant for legal entity context"],
  },
  {
    id: "consolidation-view-explicit-grant",
    requirement: "consolidation-view grant is explicit",
    testFiles: ["packages/database/src/__tests__/rls-grant.contract.test.ts"],
    coverageMarkers: ["consolidationView", "consolidation_view"],
  },
  {
    id: "client-legal-entity-id-spoofing-rejected",
    requirement: "client-provided legalEntityId spoofing rejected",
    testFiles: [
      "apps/erp/src/__tests__/operating-context-integration.test.ts",
      "apps/erp/src/lib/context/__tests__/context-switch.action.test.ts",
      "apps/erp/src/lib/context/__tests__/untrusted-client-authority.server.test.ts",
    ],
    coverageMarkers: ["legalEntityId", "authority fields"],
  },
  {
    id: "api-route-resolved-operating-context",
    requirement: "API route uses resolved operating context",
    testFiles: [
      "apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts",
      "apps/erp/src/__tests__/operating-context-integration.test.ts",
    ],
    coverageMarkers: ["verified operating context", "operatingContext"],
  },
  {
    id: "server-action-resolved-operating-context",
    requirement: "server action uses resolved operating context",
    testFiles: [
      "apps/erp/src/__tests__/operating-context-integration.test.ts",
      "apps/erp/src/__tests__/server-action-security.test.ts",
    ],
    coverageMarkers: ["resolveActionOperatingContext", "operating context"],
  },
  {
    id: "appshell-context-switch-server-side",
    requirement: "AppShell context switch validates server-side",
    testFiles: [
      "apps/erp/src/lib/context/__tests__/context-switch.action.test.ts",
      "apps/erp/src/__tests__/operating-context-integration.test.ts",
    ],
    coverageMarkers: [
      "switchOperatingContextAction",
      "validates context switch server-side",
    ],
  },
  {
    id: "csp-rbac-correlation-regression",
    requirement: "CSP/RBAC/correlation regression",
    testFiles: [
      "apps/erp/src/lib/security/__tests__/csp-hybrid-regression.test.ts",
      "apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts",
      "apps/erp/src/__tests__/correlation-middleware.test.ts",
    ],
    coverageMarkers: ["CSP", "correlation", "authorized actor"],
  },
] as const;

export const MULTI_TENANCY_TEST_REQUIREMENT_MARKERS =
  MULTI_TENANCY_TEST_REQUIREMENTS.map(
    (entry) => entry.requirement
  ) as readonly string[];

/** Delivery doc subsection markers — one matrix per concern group. */
export const MULTI_TENANCY_TESTS_DIMENSIONS = [
  {
    id: "test-matrix",
    title: "Step 9 test coverage matrix",
    tableMarker: "### Step 9 test coverage matrix",
  },
  {
    id: "tenant-url-tests",
    title: "Tenant URL and slug tests",
    tableMarker: "### Tenant URL and slug tests",
  },
  {
    id: "authority-boundary-tests",
    title: "Authority boundary tests",
    tableMarker: "### Authority boundary tests",
  },
  {
    id: "integration-boundary-tests",
    title: "Integration boundary tests",
    tableMarker: "### Integration boundary tests",
  },
  {
    id: "security-regression-tests",
    title: "Security regression tests",
    tableMarker: "### Security regression tests",
  },
] as const;

export const MULTI_TENANCY_TESTS_GATE =
  "scripts/governance/check-multi-tenancy-tests.mts" as const;

export const MULTI_TENANCY_TESTS_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-tests-enforcement.mts" as const;
