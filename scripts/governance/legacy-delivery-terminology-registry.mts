/**
 * Legacy delivery terminology guard — blocks reintroduction of retired TIP/FDR
 * identifiers in active surfaces. Historical evidence remains under docs/adr/.
 */

export const LEGACY_DELIVERY_TERMINOLOGY_SURFACE_RULE =
  "legacy-delivery-terminology-guard-blocks-fdr-tip-in-active-surfaces" as const;

export interface LegacyDeliveryTerminologyPattern {
  readonly id: string;
  readonly label: string;
  readonly pattern: RegExp;
}

/** Patterns that must not appear outside allowed historical paths. */
export const LEGACY_DELIVERY_TERMINOLOGY_PATTERNS = [
  {
    id: "fdr-word",
    pattern: /\bFDR\b/g,
    label: "FDR delivery acronym",
  },
  {
    id: "fdr-id",
    pattern: /\bfdr-[0-9a-z]/gi,
    label: "fdr-NNN identifier",
  },
  {
    id: "tip-id",
    pattern: /\bTIP-[0-9]/g,
    label: "TIP-NNN identifier",
  },
  {
    id: "tip-ui-id",
    pattern: /\bTIP-UI-[0-9]/gi,
    label: "TIP-UI-NN identifier",
  },
  {
    id: "tip-status-index",
    pattern: /\btip-status-index\b/gi,
    label: "retired tip-status-index",
  },
  {
    id: "fdr-status-index",
    pattern: /\bfdr-status-index\b/gi,
    label: "retired fdr-status-index",
  },
  {
    id: "write-fdr",
    pattern: /\bwrite-fdr(?:-slice)?\b/gi,
    label: "retired write-fdr skill",
  },
  {
    id: "fdr-orchestrator",
    pattern: /\bfdr-orchestrator\b/gi,
    label: "retired fdr-orchestrator agent",
  },
  {
    id: "fdr-slice-agent",
    pattern: /\bfdr-slice-(?:author|implementer)\b/gi,
    label: "retired fdr-slice agent",
  },
  {
    id: "afenda-fdr-batch",
    pattern: /\bafenda-fdr-batch\b/gi,
    label: "retired afenda-fdr-batch skill",
  },
  {
    id: "tip-004-policy",
    pattern: /tip-004-policy/gi,
    label: "retired tip-004-policy path",
  },
] as const satisfies readonly LegacyDeliveryTerminologyPattern[];

/** Directory names skipped during repository walk. */
export const LEGACY_DELIVERY_TERMINOLOGY_SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  ".next",
  "coverage",
  ".turbo",
  ".husky",
  "mcps",
  "agent-transcripts",
]);

/** Path prefixes excluded from scanning (historical constitutional evidence). */
export const LEGACY_DELIVERY_TERMINOLOGY_SKIP_PATH_PREFIXES = [
  "docs/adr/",
] as const;

/** Individual files excluded (audit trail, one-shot migration scripts, this guard). */
export const LEGACY_DELIVERY_TERMINOLOGY_SKIP_FILES = new Set([
  "docs/PAS/pas-status-index.md",
  "scripts/governance/normalize-legacy-delivery-terminology.mjs",
  "scripts/governance/rename-tip-governance-constants.mjs",
  "scripts/governance/legacy-delivery-terminology-registry.mts",
  "scripts/governance/check-legacy-delivery-terminology.mts",
  "scripts/governance/documentation-drift-registry.mts",
  "scripts/governance/check-documentation-drift.mts",
  "scripts/governance/__tests__/check-legacy-delivery-terminology.test.ts",
  "pnpm-lock.yaml",
  ".cursor-biome-report.json",
]);

/** File extensions scanned for legacy terminology. */
export const LEGACY_DELIVERY_TERMINOLOGY_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".mdc",
  ".ts",
  ".tsx",
  ".mts",
  ".mjs",
  ".js",
  ".json",
  ".css",
  ".sql",
]);

/** Line-level allow rules — references to ADR filenames are permitted. */
export const LEGACY_DELIVERY_TERMINOLOGY_ALLOWED_LINE_MARKERS = [
  "docs/adr/",
] as const;

/** Generated CSS — comment prefix policy is enforced at token registry source. */
export const LEGACY_DELIVERY_TERMINOLOGY_SKIP_GENERATED_CSS = new Set([
  "packages/css-authority/src/css/afenda-tokens.css",
  "packages/css-authority/dist/css/afenda-tokens.css",
]);
