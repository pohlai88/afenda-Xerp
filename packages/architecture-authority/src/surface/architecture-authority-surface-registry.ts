/**
 * Canonical architecture authority surface registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Architecture authority, lines 421–445).
 *
 * `@afenda/architecture-authority` owns package/layer/dependency maps and
 * validators. It must remain framework-free and never import runtime authority.
 */
export const ARCHITECTURE_AUTHORITY_SURFACE_RULE =
  "registry-and-validator-authority; maps-are-source-of-truth-for-docs-and-ci" as const;

/** Machine-readable registry modules that back the architecture docs. */
export const ARCHITECTURE_AUTHORITY_DATA_MODULES = [
  {
    path: "data/package-registry.data.ts",
    role: "Workspace package registry",
    primaryExports: ["packageContract", "packageByName"],
  },
  {
    path: "data/dependency-registry.data.ts",
    role: "Approved runtime dependency edges",
    primaryExports: ["dependencyContract"],
  },
  {
    path: "data/layer-registry.data.ts",
    role: "Layer assignments and cross-layer matrix",
    primaryExports: ["layerContract", "getPackageLayer", "isLayerDependencyAllowed"],
  },
  {
    path: "data/ownership-registry.data.ts",
    role: "Package ownership audit registry",
    primaryExports: ["ownershipContract", "ownershipByPackage"],
  },
  {
    path: "data/exception-registry.data.ts",
    role: "ADR exception registry",
    primaryExports: ["exceptionContract"],
  },
  {
    path: "data/lifecycle-registry.data.ts",
    role: "Package lifecycle states",
    primaryExports: ["lifecycleContract"],
  },
] as const;

/** Validators consumed by CI architecture gates. */
export const ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES = [
  {
    path: "validators/validate-architecture.ts",
    role: "Composite architecture gate",
    primaryExports: ["validateArchitecture"],
  },
  {
    path: "validators/validate-registry.ts",
    role: "Filesystem vs registry alignment",
    primaryExports: ["validateRegistry"],
  },
  {
    path: "validators/validate-dependencies.ts",
    role: "Approved runtime dependency enforcement",
    primaryExports: ["validateDependencies"],
  },
  {
    path: "validators/validate-forbidden-dependencies.ts",
    role: "Cross-layer dependency enforcement",
    primaryExports: ["validateForbiddenDependencies"],
  },
] as const;

/** Human-readable docs that must stay aligned with registry data. */
export const ARCHITECTURE_AUTHORITY_CANONICAL_DOCS = [
  {
    path: "docs/architecture/package-registry.md",
    fingerprintRequired: true,
    role: "Human package registry",
  },
  {
    path: "docs/architecture/dependency-registry.md",
    fingerprintRequired: true,
    role: "Human dependency registry",
  },
  {
    path: "docs/architecture/layer-registry.md",
    fingerprintRequired: true,
    role: "Human layer registry",
  },
] as const;

/** Committed drift snapshot generated from live workspace graphs. */
export const ARCHITECTURE_AUTHORITY_DEPENDENCY_SNAPSHOT =
  "docs/architecture/dependency-snapshot.json" as const;

/**
 * Human layer-registry.md may use extended labels while machine registry stays canonical.
 * Gate accepts any listed display variant for the package row.
 */
export const LAYER_DOC_DISPLAY_OVERRIDES: Readonly<
  Record<string, readonly string[]>
> = {
  "@afenda/typescript-config": ["Platform (tooling)", "Platform"],
};

/** Doc remediation commands surfaced in gate failure messages. */
export const ARCHITECTURE_DOC_SYNC_COMMANDS = {
  dependencySnapshot: "pnpm architecture:dependencies",
  architectureValidation: "pnpm quality:architecture",
} as const;

/**
 * Multi-tenancy dependency ownership (multi-tenancy.md lines 432–439).
 * Documented for governance gates — enforcement uses forbidden edges below.
 */
export const MULTI_TENANCY_AUTHORITY_OWNERS = [
  { owner: "@afenda/kernel", responsibility: "serializable context contracts" },
  { owner: "@afenda/database", responsibility: "persistence and query adapters" },
  { owner: "apps/erp", responsibility: "Next.js request/context integration" },
  { owner: "@afenda/permissions", responsibility: "permission and grant decisions" },
  { owner: "@afenda/observability", responsibility: "logging/audit evidence" },
  {
    owner: "@afenda/appshell",
    responsibility: "display and context-switch UI only",
  },
] as const;

/** Runtime edges explicitly forbidden by multi-tenancy authority boundaries. */
export const MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES = [
  {
    from: "@afenda/appshell",
    to: "@afenda/database",
    reason: "AppShell must not resolve tenant/database authority",
  },
  {
    from: "@afenda/appshell",
    to: "@afenda/permissions",
    reason: "AppShell must not evaluate grants — consume context only",
  },
] as const;

/** package.json dependencies forbidden for listed packages. */
export const MULTI_TENANCY_FORBIDDEN_PACKAGE_DEPENDENCIES = [
  {
    packageName: "@afenda/kernel",
    forbidden: ["next", "react", "react-dom"],
    reason: "Kernel must not depend on Next.js or React",
  },
  {
    packageName: "@afenda/appshell",
    forbidden: ["@afenda/database", "@afenda/permissions"],
    reason: "AppShell must not import database or permission authority",
  },
  {
    packageName: "@afenda/architecture-authority",
    forbidden: [
      "@afenda/database",
      "@afenda/permissions",
      "@afenda/auth",
      "next",
      "react",
      "react-dom",
    ],
    reason: "Architecture authority must remain map/validator pure",
  },
] as const;

/** ERP must delegate permission evaluation — never host a duplicate engine. */
export const ERP_FORBIDDEN_PERMISSION_ENGINE_SYMBOLS = [
  "export const PERMISSION_REGISTRY",
  "class PermissionEngine",
] as const;

export const ERP_PERMISSION_ENGINE_SCAN_ROOT = "apps/erp/src" as const;

/** Workspace roots scanned for forbidden @afenda/architecture-authority deep imports. */
export const ARCHITECTURE_AUTHORITY_CONSUMER_SCAN_ROOTS = [
  "scripts/architecture",
  "scripts/quality",
  "packages/ai-governance/src",
] as const;

/** Approved @afenda/architecture-authority import suffixes — root and surface barrel only. */
export const ARCHITECTURE_AUTHORITY_APPROVED_IMPORT_SUFFIXES = ["", "/surface"] as const;

/** Approved runtime dependency edges for architecture-authority (zero @afenda/* deps). */
export const ARCHITECTURE_AUTHORITY_APPROVED_RUNTIME_DEPENDENCIES = [] as const;
