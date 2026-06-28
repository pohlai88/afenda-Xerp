/**
 * Canonical testing and verification acceptance registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§667–685).
 */
import { MULTI_TENANCY_VERIFICATION_COMMANDS } from "./multi-tenancy-documentation-verification-registry.mts";

export const MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE =
  "multi-tenancy-testing-verification-acceptance-is-canonical-slice-signoff-matrix" as const;

/** Markers that must appear in multi-tenancy.md (§667–685). */
export const MULTI_TENANCY_DOC_TESTING_VERIFICATION_MARKERS = [
  "Testing acceptance:",
  "Verification acceptance:",
  "Tenant/domain tests pass",
  "Entity group/legal entity tests pass",
  "Ownership interest tests pass",
  "Grant scope tests pass",
  "Spoofing tests pass",
  "AppShell context switch tests pass where applicable",
  "CSP/RBAC/correlation regression tests pass",
  "Existing tests still pass",
  "If a failure is unrelated/pre-existing, document exact blocker",
] as const;

/** Delivery doc H2 containing sign-off content (shared with Step 10). */
export const MULTI_TENANCY_TESTING_VERIFICATION_SECTION =
  "Verification results" as const;

export const MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS = [
  {
    id: "testing-acceptance",
    title: "Testing acceptance",
    tableMarker: "### Testing acceptance",
  },
  {
    id: "verification-acceptance",
    title: "Verification acceptance",
    tableMarker: "### Verification acceptance",
  },
  {
    id: "pre-existing-blockers",
    title: "Pre-existing blockers",
    tableMarker: "### Pre-existing blockers",
  },
] as const;

/** Testing acceptance bullets — one row per multi-tenancy.md §669–676. */
export const MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS = [
  {
    id: "tenant-domain-tests",
    requirement: "Tenant/domain tests pass",
    deliveryMarker: "Tenant/domain tests pass",
    testFiles: [
      "apps/erp/src/__tests__/tenant-domain.test.ts",
      "packages/database/src/__tests__/tenant.contract.test.ts",
    ],
    coverageMarkers: ["tenant slug", "normalizes tenant slugs"],
  },
  {
    id: "entity-group-legal-entity-tests",
    requirement: "Entity group/legal entity tests pass",
    deliveryMarker: "Entity group/legal entity tests pass",
    testFiles: [
      "apps/erp/src/__tests__/operating-context.resolution.contract.test.ts",
      "apps/erp/src/lib/context/__tests__/resolve-legal-entity-context.test.ts",
    ],
    coverageMarkers: ["entity group", "resolveLegalEntityContext"],
  },
  {
    id: "ownership-interest-tests",
    requirement: "Ownership interest tests pass",
    deliveryMarker: "Ownership interest tests pass",
    testFiles: [
      "packages/database/src/__tests__/ownership-interest.contract.test.ts",
    ],
    coverageMarkers: ["relationshipType", "controlType"],
  },
  {
    id: "grant-scope-tests",
    requirement: "Grant scope tests pass",
    deliveryMarker: "Grant scope tests pass",
    testFiles: [
      "apps/erp/src/lib/context/__tests__/resolve-grant-scope.test.ts",
      "packages/database/src/__tests__/rls-grant.contract.test.ts",
    ],
    coverageMarkers: ["resolveGrantScope", "membershipMatchesGrantScope"],
  },
  {
    id: "spoofing-tests",
    requirement: "Spoofing tests pass",
    deliveryMarker: "Spoofing tests pass",
    testFiles: [
      "apps/erp/src/__tests__/operating-context-integration.test.ts",
      "apps/erp/src/lib/context/__tests__/context-switch.action.test.ts",
    ],
    coverageMarkers: [
      "rejectUntrustedAuthorityFields",
      "switchOperatingContextAction",
    ],
  },
  {
    id: "appshell-context-switch-tests",
    requirement: "AppShell context switch tests pass where applicable",
    deliveryMarker: "AppShell context switch tests pass where applicable",
    testFiles: [
      "apps/erp/src/lib/context/__tests__/context-switch.action.test.ts",
      "packages/appshell/src/__tests__/downstream-governance-wiring.test.ts",
    ],
    coverageMarkers: ["switchOperatingContextAction", "operating context"],
  },
  {
    id: "csp-rbac-correlation-regression-tests",
    requirement: "CSP/RBAC/correlation regression tests pass",
    deliveryMarker: "CSP/RBAC/correlation regression tests pass",
    testFiles: [
      "apps/erp/src/lib/security/__tests__/csp-hybrid-regression.test.ts",
      "apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts",
      "apps/erp/src/__tests__/correlation-middleware.test.ts",
    ],
    coverageMarkers: [
      "Content-Security-Policy",
      "authorizeApiRoute",
      "x-correlation-id",
    ],
  },
  {
    id: "existing-tests-still-pass",
    requirement: "Existing tests still pass",
    deliveryMarker: "Existing tests still pass",
    testFiles: [
      "scripts/governance/__tests__/check-multi-tenancy-tests.test.ts",
      "scripts/governance/__tests__/check-multi-tenancy-enterprise-acceptance.test.ts",
    ],
    coverageMarkers: ["passes on the current repository state"],
  },
] as const;

/** Verification acceptance bullets — multi-tenancy.md §680–684. */
export const MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS =
  MULTI_TENANCY_VERIFICATION_COMMANDS.map((entry) => ({
    id: entry.id,
    requirement: `${entry.command} passes`,
    command: entry.command,
    packageJsonScript: entry.packageJsonScript,
    deliveryMarker: entry.command,
  }));

/** Required prose when monorepo-wide commands are blocked outside this slice. */
export const MULTI_TENANCY_PRE_EXISTING_BLOCKER_MARKERS = [
  "pre-existing",
  "@afenda/ui",
  "Slice checks pass",
] as const;

export const MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_GATE =
  "scripts/governance/check-multi-tenancy-testing-verification-acceptance.mts" as const;

export const MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-testing-verification-acceptance-enforcement.mts" as const;
