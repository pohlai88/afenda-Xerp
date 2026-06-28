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
    primaryExports: [
      "layerContract",
      "getPackageLayer",
      "isLayerDependencyAllowed",
    ],
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
  {
    path: "data/foundation-disposition.registry.ts",
    role: "Foundation package disposition lanes for subagents (ADR-0014)",
    primaryExports: [
      "foundationDispositionRegistry",
      "FOUNDATION_DISPOSITION_REGISTRY",
      "getFoundationDispositionEntry",
    ],
  },
  {
    path: "data/business-master-data-scaffold.policy.ts",
    role: "ADR-0020 reserved domain package directory scaffold guard",
    primaryExports: [
      "BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS",
      "assertAuthorityOnlyRuntimeStatus",
    ],
  },
  {
    path: "data/business-master-data-authority.registry.ts",
    role: "ADR-0020 business entity → domain package authority map (relocated from kernel K2)",
    primaryExports: [
      "BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY",
      "getBusinessMasterDataAuthority",
    ],
  },
  {
    path: "data/business-master-data-import-boundary.policy.ts",
    role: "Foundation phase 08 import-prefix guard for domain contracts",
    primaryExports: [
      "assertBusinessMasterDataImportBoundary",
      "BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES",
    ],
  },
  {
    path: "data/business-master-data-shared-package.policy.ts",
    role: "ADR-0020 persistence ownership per reserved domain package",
    primaryExports: [
      "assertSharedPackageOwnershipPolicy",
      "summarizePackageOwnership",
    ],
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
  {
    path: "validators/validate-cycles.ts",
    role: "Dependency cycle detection",
    primaryExports: ["validateCycles"],
  },
  {
    path: "validators/validate-layers.ts",
    role: "Layer assignment and cross-layer matrix",
    primaryExports: ["validateLayers"],
  },
  {
    path: "validators/validate-ownership.ts",
    role: "Package ownership audit",
    primaryExports: ["validateOwnership", "findMissingOwnershipViolations"],
  },
  {
    path: "validators/validate-exceptions.ts",
    role: "ADR exception registry validation",
    primaryExports: ["validateExceptions", "validateExceptionEntries"],
  },
  {
    path: "validators/validate-foundation-disposition.ts",
    role: "Foundation disposition registry integrity (ADR-0014)",
    primaryExports: ["validateFoundationDisposition"],
  },
  {
    path: "validators/validate-lifecycle.ts",
    role: "Lifecycle policy and registry status enforcement (ADR-0006)",
    primaryExports: ["validateLifecycle"],
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
  {
    path: "docs/architecture/foundation-disposition.md",
    fingerprintRequired: false,
    role: "Read-only foundation disposition view (ADR-0014)",
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

export const MULTI_TENANCY_DEPENDENCY_RULES_SURFACE_RULE =
  "multi-tenancy-dependency-rules-enforced-by-governance-gate" as const;

/**
 * Multi-tenancy dependency ownership (multi-tenancy.md lines 432–439).
 * Documented for governance gates — enforcement uses forbidden edges below.
 */
export const MULTI_TENANCY_AUTHORITY_OWNERS = [
  { owner: "@afenda/kernel", responsibility: "serializable context contracts" },
  {
    owner: "@afenda/database",
    responsibility: "persistence and query adapters",
  },
  { owner: "apps/erp", responsibility: "Next.js request/context integration" },
  {
    owner: "@afenda/permissions",
    responsibility: "permission and grant decisions",
  },
  { owner: "@afenda/observability", responsibility: "logging/audit evidence" },
  {
    owner: "@afenda/appshell",
    responsibility: "display and context-switch UI only",
  },
] as const;

/**
 * Registry edges that must remain approved (multi-tenancy.md line 445).
 * If architecture validation fails for these edges, fix dependency-registry.data.ts.
 */
export const MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES = [
  {
    from: "@afenda/erp",
    to: "@afenda/kernel",
    reason:
      "ERP integrates serializable context contracts from kernel — fix dependency registry if architecture check fails",
  },
  {
    from: "@afenda/erp",
    to: "@afenda/permissions",
    reason:
      "ERP delegates grant decisions — must not duplicate permission engine",
  },
  {
    from: "@afenda/permissions",
    to: "@afenda/kernel",
    reason:
      "Grant vocabulary from kernel; resolved PermissionScopeContext owned by permissions (K5)",
  },
  {
    from: "@afenda/appshell",
    to: "@afenda/kernel",
    reason: "AppShell consumes serializable context labels only",
  },
] as const;

/** Markers required in multi-tenancy.md Dependency rules section (lines 432–445). */
export const MULTI_TENANCY_DEPENDENCY_DOC_MARKERS = [
  "Dependency rules:",
  "@afenda/kernel` owns serializable context contracts",
  "@afenda/database` owns persistence and query adapters",
  "apps/erp` owns Next.js request/context integration",
  "@afenda/permissions` owns permission and grant decisions",
  "@afenda/observability` owns logging/audit evidence",
  "@afenda/appshell` owns display and context-switch UI only",
  "@afenda/appshell` must not depend on `@afenda/database`",
  "@afenda/kernel` must not depend on Next.js or React",
  "apps/erp` must not duplicate permission engine",
  "No deep imports",
  "No unapproved dependencies",
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

/**
 * ERP files that orchestrate @afenda/permissions — not duplicate engines.
 * Excluded from erp-permission-engine-duplication scan (false-positive mitigation).
 */
export const ERP_PERMISSION_ENGINE_ORCHESTRATION_RELATIVE_PATHS = [
  "apps/erp/src/lib/api/authorize-api-route.ts",
] as const;

/** Gate ownership — dependency-rules gate is authoritative for §432–445 enforcement. */
export const MULTI_TENANCY_GATE_OWNERSHIP = {
  dependencyRules:
    "scripts/governance/check-multi-tenancy-dependency-rules.mts",
  dosProhibitions:
    "scripts/governance/check-multi-tenancy-dos-prohibitions.mts",
  architectureAuthority:
    "scripts/governance/check-architecture-authority-surface.mts",
} as const;

/** Shared enforcement module — single source for §432–445 runtime boundary checks. */
export const MULTI_TENANCY_DEPENDENCY_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-dependency-enforcement.mts" as const;

/** Registry files to update when live architecture validation reports drift. */
export const ARCHITECTURE_REGISTRY_DRIFT_SOURCES = {
  dependency:
    "packages/architecture-authority/src/data/dependency-registry.data.ts",
  package: "packages/architecture-authority/src/data/package-registry.data.ts",
  layer: "packages/architecture-authority/src/data/layer-registry.data.ts",
  ownership:
    "packages/architecture-authority/src/data/ownership-registry.data.ts",
  snapshot: "docs/architecture/dependency-snapshot.json",
} as const;

/** Workspace roots scanned for forbidden @afenda/architecture-authority deep imports. */
export const ARCHITECTURE_AUTHORITY_CONSUMER_SCAN_ROOTS = [
  "scripts/architecture",
  "scripts/quality",
  "packages/ai-governance/src",
] as const;

/** Approved @afenda/architecture-authority import suffixes — root and surface barrel only. */
export const ARCHITECTURE_AUTHORITY_APPROVED_IMPORT_SUFFIXES = [
  "",
  "/surface",
] as const;

/** Approved runtime dependency edges for architecture-authority (zero @afenda/* deps). */
export const ARCHITECTURE_AUTHORITY_APPROVED_RUNTIME_DEPENDENCIES = [] as const;
