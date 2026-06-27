/**
 * Documentation drift guard registry (ADR-0009, PAS authority).
 *
 * Lightweight stale-marker detection — not a full doc linter.
 */

export const DOCUMENTATION_DRIFT_SURFACE_RULE =
  "documentation-drift-guard-is-canonical-stale-marker-enforcement";

export const RUNTIME_TRUTH_MATRIX =
  "docs/architecture/afenda-runtime-truth-matrix.md";

export const PRE_ACCOUNTING_ROADMAP =
  "docs/architecture/pre-accounting-foundation-roadmap.md";

export const MASTER_PLAN = "docs/architecture/_afenda-erp-master-plan.llms.md";

export const DRIFT_AUDIT =
  "docs/architecture/afenda-documentation-drift-audit.md";

/** Canonical Package Authority Standards index (PAS). */
export const PAS_README = "docs/PAS/README.md" as const;

export const PAS_KERNEL_STANDARD =
  "docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md" as const;

export const PAS_SLICE_DIR = "docs/PAS/slice" as const;

/** Authority docs scanned for references to removed legacy delivery paths. */
export const LEGACY_DELIVERY_PATH_SCAN_FILES = [
  "docs/architecture/afenda-runtime-truth-matrix.md",
  "docs/architecture/README.md",
  "docs/architecture/multi-tenancy.md",
  "docs/governance/tip-004-policy.md",
  "docs/governance/README.md",
  "AGENTS.md",
  "docs/README.md",
] as const;

/** Patterns that must not appear in authority docs after legacy cleanup. */
export const LEGACY_DELIVERY_PATH_PATTERN = /docs\/(?:delivery|ARCH)\//gi;

/** Relative markdown links to retired delivery/ARCH trees. */
export const LEGACY_RELATIVE_DELIVERY_PATH_PATTERN =
  /\]\((?:\.\.\/)+(?:delivery|ARCH)\//gi;

/** Canonical architecture baseline fingerprint (must match dependency-snapshot.json). */
export const ARCHITECTURE_BASELINE_DOC =
  "docs/architecture/architecture-authority-baseline.md";

export const OBSOLETE_BASELINE_FINGERPRINT =
  "ARCH-BASELINE-2026-06-20-v1" as const;

/** Human registry docs that must carry the current baseline fingerprint. */
export const FINGERPRINT_REQUIRED_DOCS = [
  "docs/architecture/package-registry.md",
  "docs/architecture/dependency-registry.md",
  "docs/architecture/layer-registry.md",
] as const;

/** ADRs that must be Accepted after foundation documentation closeout. */
export const REQUIRED_ACCEPTED_ADRS = [
  "docs/adr/ADR-0009-runtime-truth-before-roadmap.md",
  "docs/adr/ADR-0010-no-accounting-before-foundation-gate.md",
  "docs/adr/ADR-0011-multi-level-company-model-foundational.md",
  "docs/adr/ADR-0012-documentation-evidence-backed.md",
  "docs/adr/ADR-0013-tip-roadmap-delivery-authority.md",
  "docs/adr/ADR-0014-foundation-disposition-registry.md",
  "docs/adr/ADR-0016-fdr-delivery-authority.md",
] as const;

/** Markers that must NOT appear — evidence of stale documentation. */
export const STALE_DELIVERY_MARKERS = [
  {
    file: "docs/architecture/authentication-ecosystem.md",
    forbidden: [
      "Dual presentation tracks",
      "Set `AFENDA_AUTH_SHELL_V2_DEFAULT=false`",
      "`@afenda/appshell/auth-shell-v2`",
      "apps/erp/(auth-v2)",
    ],
    rule: "auth-ecosystem-stale-dual-stack",
  },
  {
    file: "docs/architecture/afenda-runtime-truth-matrix.md",
    forbidden: ["auth-shell-V2", "(auth-v2)"],
    rule: "runtime-matrix-stale-auth-v2-paths",
  },
  {
    file: "docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
    forbidden: [
      "@afenda/kernel/accounting-domain",
      "./accounting-domain",
      "dist/contracts/accounting-domain",
      "src/contracts/accounting-domain",
    ],
    rule: "pas-001-retired-accounting-domain-subpath",
  },
  {
    file: ".cursor/skills/kernel-authority/SKILL.md",
    forbidden: ["@afenda/kernel/accounting-domain", "contracts/accounting-domain/"],
    rule: "kernel-authority-skill-retired-accounting-domain-path",
  },
] as const;

/** Master plan must reference current authority artifacts. */
export const MASTER_PLAN_REQUIRED_MARKERS = [
  "version: 5.0.0",
  "afenda-runtime-truth-matrix.md",
  "pre-accounting-foundation-roadmap.md",
  "ADR-0010",
  "Do not use older roadmap sections",
] as const;

/** Forbidden as *current* authority without stale qualifier. */
export const MASTER_PLAN_FORBIDDEN_MARKERS = [
  "version: 4.0.0",
  "Implementation reality audit (2026-06-20)",
] as const;
