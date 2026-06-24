/**
 * Documentation drift guard registry (TIP-000D / ADR-0009, ADR-0012).
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

export const TIP_STATUS_INDEX = "docs/delivery/tip-status-index.md";

/** Canonical TIP delivery doc directory (ADR-0013 / tip-status-index). */
export const TIP_DELIVERY_TIPS_DIR = "docs/delivery/tips" as const;

/** Index must reference tips/ paths — not legacy docs/delivery/tip-*.md root layout. */
export const TIP_STATUS_INDEX_TIPS_PATH_MARKER = "docs/delivery/tips/" as const;

/** Only this file may live at docs/delivery/tip-*.md root (not under tips/). */
export const TIP_STATUS_INDEX_BASENAME = "tip-status-index.md" as const;

/**
 * Authority docs scanned for legacy delivery paths (`docs/delivery/tip-*.md` without `tips/`).
 * Catches stale links that look like drift after the tips/ restructure.
 */
export const LEGACY_DELIVERY_PATH_SCAN_FILES = [
  "docs/architecture/afenda-runtime-truth-matrix.md",
  "docs/architecture/README.md",
  "docs/architecture/multi-tenancy.md",
  "docs/governance/tip-004-policy.md",
  "docs/governance/README.md",
  "AGENTS.md",
] as const;

/** Regex: legacy root delivery path (excludes tip-status-index). */
export const LEGACY_DELIVERY_PATH_PATTERN =
  /(?:docs\/delivery|\.\.\/delivery)\/tip-(?!status-index)[a-z0-9-]+\.md/gi;

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

/** ADRs that must be Accepted after TIP-000D closeout. */
export const REQUIRED_ACCEPTED_ADRS = [
  "docs/adr/ADR-0009-runtime-truth-before-roadmap.md",
  "docs/adr/ADR-0010-no-accounting-before-foundation-gate.md",
  "docs/adr/ADR-0011-multi-level-company-model-foundational.md",
  "docs/adr/ADR-0012-documentation-evidence-backed.md",
  "docs/adr/ADR-0013-tip-roadmap-delivery-authority.md",
] as const;

/** Markers that must NOT appear — evidence of stale delivery doc. */
export const STALE_DELIVERY_MARKERS = [
  {
    file: "docs/delivery/tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md",
    forbidden: ["Status: **Not started**"],
    rule: "tip-ui-03-stale-status",
  },
  {
    file: "docs/delivery/tips/[Partially Implemented] tip-ui-04-metadata-ui-renderers.md",
    forbidden: [
      "Status: **Not started**",
      "zero React renderer implementations",
      "no UI. This TIP delivers",
    ],
    rule: "tip-ui-04-stale-status",
  },
  {
    file: "docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md",
    forbidden: [
      "Status: **Not started**",
      "No CSS import",
      "Inline styles, native inputs",
    ],
    rule: "tip-ui-05-stale-status",
  },
  {
    file: "docs/delivery/tips/[Complete] tip-006-appshell-authority.md",
    forbidden: [
      "**Status** | **Partially Implemented**",
      "Authority contracts not frozen",
      "Verdict\n\n**Partially Implemented**",
    ],
    rule: "tip-006-stale-verdict",
  },
  {
    file: "docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md",
    forbidden: ["Status: **Not started**"],
    rule: "tip-008-stale-status",
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
