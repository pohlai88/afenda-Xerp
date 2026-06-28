/**
 * PAS-001 §6.1 / §6.2 / §6.4 — kernel package structure and subpath export registry.
 *
 * Single source for governance gate + filesystem acceptance tests.
 */

export const KERNEL_PACKAGE_PAS_SECTIONS = {
  current: "6.1",
  structure: "6.2",
  exports: "6.4",
} as const;

/**
 * PAS folder boundary — why `context/` and `contracts/` both exist:
 *
 * - `context/` — §4.4 operating-context hierarchy shapes + scope slots on
 *   `OperatingContext` (public `@afenda/kernel/context`). Shapes only — no resolvers.
 * - `contracts/` — cross-cutting platform wire vocabulary (Result, AppError,
 *   ExecutionContext, ProblemDetail). Not operating-context stack modules.
 * - `erp-domain/` — §4.8 ERP domain vocabulary modules (`accounting/`, …).
 *   Public subpath: `@afenda/kernel/erp-domain/{module}`.
 */
export const KERNEL_SRC_FOLDER_BOUNDARY = {
  context: "operating-context-shapes",
  contracts: "platform-wire-vocabulary",
  erpDomain: "erp-domain-vocabulary",
} as const;

/** Repo-relative paths that must not reappear after relocation slices. */
export const RETIRED_KERNEL_REPO_PATHS = [
  "packages/kernel/src/context/consolidation-scope-resolution.ts",
  "packages/kernel/src/context/consolidation-scope-investee-merge.policy.ts",
  "packages/kernel/src/context/runtime-module-path.ts",
  "packages/kernel/src/context/accounting-readiness-context.contract.ts",
  "packages/kernel/src/context/accounting-readiness.contract.ts",
  "packages/kernel/src/context/untrusted-client-authority.contract.ts",
  "packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts",
  "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts",
  "packages/kernel/src/contracts/business-master-data/business-master-data-import-boundary.policy.ts",
  "packages/kernel/src/contracts/business-master-data/business-master-data-shared-package.policy.ts",
  "packages/kernel/src/contracts/business-master-data/index.ts",
  "packages/kernel/src/contracts/accounting-domain/index.ts",
  "packages/kernel/src/contracts/accounting-domain/bridge/to-accounting-domain-context.ts",
] as const;

export type RetiredKernelRepoPath = (typeof RETIRED_KERNEL_REPO_PATHS)[number];

/** Only `index.ts` may live at `packages/kernel/src/` root. */
export const KERNEL_PACKAGE_SRC_ROOT_BARREL = "index.ts" as const;

/** Approved top-level folders under `packages/kernel/src/` (PAS §6.1). */
export const KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL = [
  "contracts",
  "context",
  "erp-domain",
  "governance",
  "identity",
  "permission",
  "propagation",
  "events",
  "policy",
  "__tests__",
] as const;

export type KernelPackageCurrentSrcTopLevel =
  (typeof KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL)[number];

/** Repo-relative paths that must exist after approved slices (PAS §6.2). */
export const KERNEL_PACKAGE_TARGET_PATHS = [
  "packages/kernel/PAS-001-KERNEL-TREE.md",
  "packages/kernel/src/contracts/problem-detail.contract.ts",
  "packages/kernel/src/context/localization-context.contract.ts",
  "packages/kernel/src/context/localization-context.assert.ts",
  "packages/kernel/src/context/localization-context.parser.ts",
  "packages/kernel/src/context/entity-group-context.contract.ts",
  "packages/kernel/src/context/entity-group-context.assert.ts",
  "packages/kernel/src/context/entity-group-context.parser.ts",
  "packages/kernel/src/context/legal-entity-context.contract.ts",
  "packages/kernel/src/context/legal-entity-context.assert.ts",
  "packages/kernel/src/context/legal-entity-context.parser.ts",
  "packages/kernel/src/context/ownership-interest-context.contract.ts",
  "packages/kernel/src/context/ownership-interest-context.assert.ts",
  "packages/kernel/src/context/ownership-interest-context.parser.ts",
  "packages/kernel/src/context/consolidation-scope-context.contract.ts",
  "packages/kernel/src/context/consolidation-scope-context.assert.ts",
  "packages/kernel/src/context/consolidation-scope-context.parser.ts",
  "packages/kernel/src/context/organization-unit-context.contract.ts",
  "packages/kernel/src/context/organization-unit-context.assert.ts",
  "packages/kernel/src/context/organization-unit-context.parser.ts",
  "packages/kernel/src/context/team-context.contract.ts",
  "packages/kernel/src/context/team-context.assert.ts",
  "packages/kernel/src/context/team-context.parser.ts",
  "packages/kernel/src/context/project-context.contract.ts",
  "packages/kernel/src/context/project-context.assert.ts",
  "packages/kernel/src/context/project-context.parser.ts",
  "packages/kernel/src/context/permission-scope-context.contract.ts",
  "packages/kernel/src/context/permission-scope-context.assert.ts",
  "packages/kernel/src/context/permission-scope-context.parser.ts",
  "packages/kernel/src/context/operating-context.contract.ts",
  "packages/kernel/src/context/operating-context.assert.ts",
  "packages/kernel/src/context/operating-context.parser.ts",
  "packages/kernel/src/propagation/index.ts",
  "packages/kernel/src/propagation/kernel-context-frame.contract.ts",
  "packages/kernel/src/propagation/kernel-context.ts",
  "packages/kernel/src/events/index.ts",
  "packages/kernel/src/events/domain-event.contract.ts",
  "packages/kernel/src/policy/index.ts",
  "packages/kernel/src/policy/policy-decision.contract.ts",
  "packages/kernel/src/policy/policy-denial-reason.contract.ts",
  "packages/kernel/src/permission/index.ts",
  "packages/kernel/src/permission/permission-action.contract.ts",
  "packages/kernel/src/permission/permission-model-scope.contract.ts",
  "packages/kernel/src/permission/permission-model.contract.ts",
  "packages/kernel/src/permission/permission-vocabulary.contract.ts",
  "packages/kernel/src/governance/index.ts",
  "packages/kernel/src/governance/kernel-prohibited-ownership.contract.ts",
  "packages/kernel/src/governance/kernel-decision-matrix.contract.ts",
  "packages/kernel/src/governance/kernel-contract-rules.policy.ts",
  "packages/kernel/src/governance/kernel-runtime-rules.contract.ts",
  "packages/kernel/src/governance/kernel-implementation-sequence.contract.ts",
  "packages/kernel/src/erp-domain/erp-domain-layout.contract.ts",
  "packages/kernel/src/erp-domain/accounting/index.ts",
] as const;

export type KernelPackageTargetPath =
  (typeof KERNEL_PACKAGE_TARGET_PATHS)[number];

/** Paths that must never be added under kernel (PAS §6.2). */
export const KERNEL_PACKAGE_PROHIBITED_PATHS = [
  "packages/kernel/src/context/currency-context.contract.ts",
  "packages/kernel/src/context/fiscal-calendar-context.contract.ts",
  "packages/kernel/src/PAS-001-Kernal-tree.md",
  "packages/kernel/src/PAS-001-KERNEL-TREE.md",
  "packages/kernel/PAS-001-Kernal-tree.md",
] as const;

export type KernelPackageProhibitedPath =
  (typeof KERNEL_PACKAGE_PROHIBITED_PATHS)[number];

/** Registered package.json subpath exports (PAS §6.3 / §6.4). Root `.` is implicit. */
export const KERNEL_PACKAGE_SUBPATH_EXPORTS = [
  "./context",
  "./erp-domain/accounting",
  "./propagation",
  "./events",
  "./policy",
  "./permission",
  "./governance",
] as const;

export type KernelPackageSubpathExport =
  (typeof KERNEL_PACKAGE_SUBPATH_EXPORTS)[number];

export const KERNEL_PACKAGE_LAYOUT_PROHIBITED_PATTERNS = [
  "currency-context.contract.ts in kernel context",
  "fiscal-calendar-context.contract.ts in kernel context",
  "PAS tree doc under packages/kernel/src/ (use packages/kernel/PAS-001-KERNEL-TREE.md)",
  "misspelled PAS-001-Kernal-tree.md filename",
  "unregistered package.json subpath export",
  "deep consumer import from @afenda/kernel/src",
  "reintroduced contracts/platform-id*.ts",
] as const;

export type KernelPackageLayoutProhibitedPattern =
  (typeof KERNEL_PACKAGE_LAYOUT_PROHIBITED_PATTERNS)[number];

export const KERNEL_PACKAGE_LAYOUT_POLICY = {
  pasSections: KERNEL_PACKAGE_PAS_SECTIONS,
  folderBoundary: KERNEL_SRC_FOLDER_BOUNDARY,
  retiredRepoPaths: RETIRED_KERNEL_REPO_PATHS,
  srcRootBarrel: KERNEL_PACKAGE_SRC_ROOT_BARREL,
  currentSrcTopLevel: KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL,
  targetPaths: KERNEL_PACKAGE_TARGET_PATHS,
  prohibitedPaths: KERNEL_PACKAGE_PROHIBITED_PATHS,
  subpathExports: KERNEL_PACKAGE_SUBPATH_EXPORTS,
  prohibitedPatterns: KERNEL_PACKAGE_LAYOUT_PROHIBITED_PATTERNS,
} as const satisfies {
  readonly pasSections: typeof KERNEL_PACKAGE_PAS_SECTIONS;
  readonly folderBoundary: typeof KERNEL_SRC_FOLDER_BOUNDARY;
  readonly retiredRepoPaths: readonly RetiredKernelRepoPath[];
  readonly srcRootBarrel: typeof KERNEL_PACKAGE_SRC_ROOT_BARREL;
  readonly currentSrcTopLevel: readonly KernelPackageCurrentSrcTopLevel[];
  readonly targetPaths: readonly KernelPackageTargetPath[];
  readonly prohibitedPaths: readonly KernelPackageProhibitedPath[];
  readonly subpathExports: readonly KernelPackageSubpathExport[];
  readonly prohibitedPatterns: readonly KernelPackageLayoutProhibitedPattern[];
};

export function isKernelPackageCurrentSrcTopLevel(
  value: string
): value is KernelPackageCurrentSrcTopLevel {
  return (KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL as readonly string[]).includes(
    value
  );
}

export function isKernelPackageSubpathExport(
  value: string
): value is KernelPackageSubpathExport {
  return (KERNEL_PACKAGE_SUBPATH_EXPORTS as readonly string[]).includes(value);
}
