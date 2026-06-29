/**
 * Documentation drift guard registry (ADR-0009, PAS authority).
 *
 * Lightweight stale-marker detection — not a full doc linter.
 */

export const DOCUMENTATION_DRIFT_SURFACE_RULE =
  "documentation-drift-guard-is-canonical-stale-marker-enforcement";

export const RUNTIME_TRUTH_MATRIX = "docs/PAS/pas-status-index.md";

export const PRE_ACCOUNTING_ROADMAP =
  "docs/architecture/_afenda-erp-master-plan.llms.md";

export const MASTER_PLAN = "docs/architecture/_afenda-erp-master-plan.llms.md";

/** @deprecated Retired with docs/architecture tree — drift guard uses pas-status-index. */
export const DRIFT_AUDIT = "docs/PAS/pas-status-index.md";

/** Canonical Package Authority Standards index (PAS). */
export const PAS_README = "docs/PAS/README.md" as const;

export const PAS_KERNEL_STANDARD =
  "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md" as const;

/** @deprecated Temporary shim — use family SLICE dirs; see docs/PAS/slice/README.md */
export const PAS_SLICE_DEPRECATED_DIR = "docs/PAS/slice" as const;

/** Kernel slice handoff SSOT (legacy flat `docs/PAS/slice/` is deprecated shim only). */
export const PAS_KERNEL_SLICE_DIR = "docs/PAS/KERNEL/SLICE" as const;

/** Accounting Standards PAS family composed SSOT. */
export const PAS_ACCOUNTING_STANDARDS_STANDARD =
  "docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md" as const;

/** Accounting Standards slice handoff SSOT. */
export const PAS_ACCOUNTING_STANDARDS_SLICE_DIR =
  "docs/PAS/ACCOUNTING-STANDARDS/SLICE" as const;

/** Presentation PAS (ERP frontend — ADR-0027). */
export const PAS_PRESENTATION_STANDARD =
  "docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md" as const;

/** Presentation PAS family index. */
export const PAS_PRESENTATION_README =
  "docs/PAS/PRESENTATION/README.md" as const;

/** @deprecated Retired — CSS Authority archived under docs/_retired/legacy-css-authority/ */
export const PAS_CSS_AUTHORITY_STANDARD = PAS_PRESENTATION_STANDARD;

/** @deprecated Retired — no active slice dir; use PRESENTATION README */
export const PAS_CSS_AUTHORITY_SLICE_DIR = PAS_PRESENTATION_README;

/** Architecture Authority PAS family composed SSOT. */
export const PAS_ARCHITECTURE_AUTHORITY_STANDARD =
  "docs/PAS/ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md" as const;

/** Architecture Authority slice handoff SSOT. */
export const PAS_ARCHITECTURE_AUTHORITY_SLICE_DIR =
  "docs/PAS/ARCHITECTURE-AUTHORITY/SLICE" as const;

/** Enterprise Knowledge PAS family composed SSOT. */
export const PAS_ENTERPRISE_KNOWLEDGE_STANDARD =
  "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md" as const;

/** Enterprise Knowledge slice handoff SSOT. */
export const PAS_ENTERPRISE_KNOWLEDGE_SLICE_DIR =
  "docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE" as const;

/** @deprecated Alias — use {@link PAS_KERNEL_SLICE_DIR}. */
export const PAS_SLICE_DIR = PAS_KERNEL_SLICE_DIR;

/** Authority docs scanned for references to removed legacy delivery paths. */
export const LEGACY_DELIVERY_PATH_SCAN_FILES = [
  "docs/PAS/pas-status-index.md",
  "AGENTS.md",
  "docs/README.md",
] as const;

/** Patterns that must not appear in authority docs after legacy cleanup. */
export const LEGACY_DELIVERY_PATH_PATTERN = /docs\/(?:delivery|ARCH)\//gi;

export const PAS_STATUS_INDEX = "docs/PAS/pas-status-index.md" as const;

/** Patterns that must not appear in active authority docs (retired delivery indexes). */
export const LEGACY_DELIVERY_INDEX_PATTERN =
  /\btip-status-index\.md\b|\bfdr-status-index\.md\b|\[(?:Complete|Not started|Partially Implemented)\]\s*fdr-/gi;

/** Active surfaces scanned for retired PAS delivery index references. */
export const LEGACY_DELIVERY_INDEX_SCAN_FILES = [
  "AGENTS.md",
  "README.md",
  "docs/README.md",
  ".cursor/skills/using-afenda-skills/SKILL.md",
] as const;

/** Relative markdown links to retired delivery/ARCH trees. */
export const LEGACY_RELATIVE_DELIVERY_PATH_PATTERN =
  /\]\((?:\.\.\/)+(?:delivery|ARCH)\//gi;

/** Machine baseline fingerprint (packages/architecture-authority). */
export const ARCHITECTURE_BASELINE_DOC =
  "packages/architecture-authority/src/contracts/architecture-authority-version.ts";

export const OBSOLETE_BASELINE_FINGERPRINT =
  "ARCH-BASELINE-2026-06-20-v1" as const;

/** Human registry docs retired — machine data modules are authority. */
export const FINGERPRINT_REQUIRED_DOCS = [] as const;

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
    file: "docs/PAS/KERNEL/archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
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
    forbidden: [
      "@afenda/kernel/accounting-domain",
      "contracts/accounting-domain/",
    ],
    rule: "kernel-authority-skill-retired-accounting-domain-path",
  },
] as const;

/** Master plan must reference current authority artifacts. */
export const MASTER_PLAN_REQUIRED_MARKERS = [
  "version: 5.0.0",
  "pas-status-index.md",
  "Foundation Phase 9",
  "ADR-0010",
  "Do not use older roadmap sections",
] as const;

/** Forbidden as *current* authority without stale qualifier. */
export const MASTER_PLAN_FORBIDDEN_MARKERS = [
  "version: 4.0.0",
  "Implementation reality audit (2026-06-20)",
] as const;
