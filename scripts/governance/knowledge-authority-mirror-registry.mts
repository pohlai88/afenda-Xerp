/**
 * PAS-004D B49 — authority mirror sync surface registry.
 */

export const KNOWLEDGE_AUTHORITY_MIRROR_SURFACE_RULE =
  "knowledge-authority-mirror-sync-is-canonical-pas-skill-index-alignment";

export const EK_SKILL_PATH =
  ".cursor/skills/enterprise-knowledge/SKILL.md" as const;

export const EK_PAS_PATHS = {
  pas004: "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  pas004b: "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
  pas004c: "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
  pas004d: "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
  pasStatusIndex: "docs/PAS/pas-status-index.md",
} as const;

/** Until B54 extends scorecard to 70/70. */
export const EK_SEMANTIC_SCORECARD = "58/58" as const;

/** Active operational slice — must not regress to semantic-model slices. */
export const EK_ACTIVE_SLICE_ID = "B51" as const;

export const EK_STALE_ACTIVE_SLICE_IDS = ["Active slice: B38"] as const;

export const EK_PAS004C_SLICE_HANDOFFS = [
  "b47-pas004c-consumer-projection-adoption",
  "b48-pas004c-docs-consumer-projection-adoption",
] as const;
