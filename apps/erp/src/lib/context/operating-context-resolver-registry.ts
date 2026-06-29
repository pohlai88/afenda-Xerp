/**
 * Canonical Step 7 operating context resolver registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§561–571).
 *
 * Client slugs and IDs are selection hints only — always verified server-side.
 * Fail closed when any authority dimension is missing or suspended.
 */
export const OPERATING_CONTEXT_RESOLVER_PIPELINE = [
  {
    id: "resolve-tenant",
    step: "Resolve tenant",
    module: "resolve-operating-context-orchestrator.server.ts",
    delegate: "findTenantBySlug",
  },
  {
    id: "resolve-actor",
    step: "Resolve actor",
    module: "resolve-operating-context-orchestrator.server.ts",
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
    module: "resolve-operating-context-orchestrator.server.ts",
    delegate: "verifyProjectSelection",
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

/** Primary resolver entry points for server handlers. */
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

/** Patterns forbidden in operating context resolution — never trust session tenant. */
export const OPERATING_CONTEXT_RESOLVER_FORBIDDEN_PATTERNS = [
  "session.user.tenantId",
  "session?.user?.tenantId",
  "authSession.tenantId",
] as const;

export type OperatingContextResolverPipelineId =
  (typeof OPERATING_CONTEXT_RESOLVER_PIPELINE)[number]["id"];

export type OperatingContextResolverFunctionName =
  (typeof OPERATING_CONTEXT_RESOLVER_FUNCTIONS)[number]["name"];
