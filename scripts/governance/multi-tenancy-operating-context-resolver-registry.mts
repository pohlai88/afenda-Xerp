/**
 * Canonical Step 7 operating context resolver registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 7, lines 561–571).
 *
 * Runtime mirror: `apps/erp/src/lib/context/operating-context-resolver-registry.ts`.
 * Enforcement in `lib/multi-tenancy-operating-context-resolver-enforcement.mts`.
 */
export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SURFACE_RULE =
  "multi-tenancy-operating-context-resolver-is-canonical-fail-closed-server-assembly" as const;

/** Markers that must appear in multi-tenancy.md Step 7 (§561–571). */
export const MULTI_TENANCY_DOC_OPERATING_CONTEXT_RESOLVER_MARKERS = [
  "Step 7 — Operating context resolver",
  "Resolve tenant.",
  "Resolve actor.",
  "Resolve entity group.",
  "Resolve legal entity/company.",
  "Resolve organization unit/team/project if selected.",
  "Verify membership and grant.",
  "Return typed result.",
  "Fail closed.",
] as const;

/** Delivery doc H2 — must match `MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS` entry. */
export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_SECTION =
  "Operating context resolver" as const;

export const OPERATING_CONTEXT_RESOLVER_PIPELINE = [
  {
    id: "resolve-tenant",
    step: "Resolve tenant",
    module: "resolve-operating-context.server.ts",
    delegate: "findTenantBySlug",
  },
  {
    id: "resolve-actor",
    step: "Resolve actor",
    module: "resolve-operating-context.server.ts",
    delegate: "loadActorMemberships",
  },
  {
    id: "resolve-entity-group",
    step: "Resolve entity group",
    module: "resolve-legal-entity-context.server.ts",
    delegate: "verifyEntityGroupBoundary",
  },
  {
    id: "resolve-legal-entity",
    step: "Resolve legal entity/company",
    module: "resolve-legal-entity-context.server.ts",
    delegate: "resolveLegalEntityContext",
  },
  {
    id: "resolve-org-team-project",
    step: "Resolve organization unit/team/project if selected",
    module: "resolve-operating-context.server.ts",
    delegate: "verifyProjectBoundary",
  },
  {
    id: "verify-membership-grant",
    step: "Verify membership and grant",
    module: "resolve-grant-scope.server.ts",
    delegate: "resolveGrantScope",
  },
  {
    id: "return-typed-result",
    step: "Return typed result",
    module: "resolve-operating-context.server.ts",
    delegate: "OperatingContextResult",
  },
  {
    id: "fail-closed",
    step: "Fail closed",
    module: "context-errors.ts",
    delegate: "denyOperatingContext",
  },
] as const;

export const OPERATING_CONTEXT_RESOLVER_FUNCTIONS = [
  {
    name: "resolveOperatingContext",
    file: "lib/context/resolve-operating-context.server.ts",
  },
  {
    name: "resolveOperatingContextFromHeaders",
    file: "lib/context/resolve-operating-context-from-headers.server.ts",
  },
  {
    name: "resolveLegalEntityContext",
    file: "lib/context/resolve-legal-entity-context.server.ts",
  },
  {
    name: "resolveGrantScope",
    file: "lib/context/resolve-grant-scope.server.ts",
  },
] as const;

export const OPERATING_CONTEXT_RESOLVER_FORBIDDEN_PATTERNS = [
  "session.user.tenantId",
  "session?.user?.tenantId",
  "authSession.tenantId",
] as const;

/** Step 7 dimensions — one table per concern in §563–570. */
export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_DIMENSIONS = [
  {
    id: "resolution-pipeline",
    title: "Resolution pipeline",
    tableMarker: "### Resolution pipeline",
    registryImport:
      "apps/erp/src/lib/context/operating-context-resolver-registry.ts",
    registryExport: "OPERATING_CONTEXT_RESOLVER_PIPELINE",
  },
  {
    id: "resolver-functions",
    title: "Resolver functions",
    tableMarker: "### Resolver functions",
    registryImport:
      "apps/erp/src/lib/context/operating-context-resolver-registry.ts",
    registryExport: "OPERATING_CONTEXT_RESOLVER_FUNCTIONS",
  },
  {
    id: "membership-grant",
    title: "Membership and grant verification",
    tableMarker: "### Membership and grant verification",
    artifactPath: "apps/erp/src/lib/context/resolve-grant-scope.server.ts",
  },
  {
    id: "fail-closed",
    title: "Fail-closed behavior",
    tableMarker: "### Fail-closed behavior",
    artifactPath: "apps/erp/src/lib/context/context-errors.ts",
  },
] as const;

/** Required resolver function row markers in delivery doc. */
export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_FUNCTION_MARKERS =
  OPERATING_CONTEXT_RESOLVER_FUNCTIONS.map((entry) => entry.name) as readonly [
    "resolveOperatingContext",
    "resolveOperatingContextFromHeaders",
    "resolveLegalEntityContext",
    "resolveGrantScope",
  ];

/** Required pipeline step markers in delivery doc. */
export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_PIPELINE_MARKERS =
  OPERATING_CONTEXT_RESOLVER_PIPELINE.map(
    (entry) => entry.step
  ) as readonly string[];

export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_GATE =
  "scripts/governance/check-multi-tenancy-operating-context-resolver.mts" as const;

export const MULTI_TENANCY_OPERATING_CONTEXT_RESOLVER_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-operating-context-resolver-enforcement.mts" as const;
