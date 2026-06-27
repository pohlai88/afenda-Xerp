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

/** Only `index.ts` may live at `packages/kernel/src/` root. */
export const KERNEL_PACKAGE_SRC_ROOT_BARREL = "index.ts" as const;

/** Approved top-level folders under `packages/kernel/src/` (PAS §6.1). */
export const KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL = [
  "contracts",
  "context",
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
  "./accounting-domain",
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
  srcRootBarrel: KERNEL_PACKAGE_SRC_ROOT_BARREL,
  currentSrcTopLevel: KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL,
  targetPaths: KERNEL_PACKAGE_TARGET_PATHS,
  prohibitedPaths: KERNEL_PACKAGE_PROHIBITED_PATHS,
  subpathExports: KERNEL_PACKAGE_SUBPATH_EXPORTS,
  prohibitedPatterns: KERNEL_PACKAGE_LAYOUT_PROHIBITED_PATTERNS,
} as const satisfies {
  readonly pasSections: typeof KERNEL_PACKAGE_PAS_SECTIONS;
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
