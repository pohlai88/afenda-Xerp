/**
 * PAS-004C §4.4 — B44: broadened realization references on Knowledge Atoms.
 *
 * Extends software-centric implementationMapping with SOP, policy, regulation,
 * training, API, UI, and report realization kinds. Kernel entries cite
 * `*.contract.ts` paths only — never parsers (PAS-001 / kernel-authority).
 */

export const REALIZATION_KINDS = [
  "kernel",
  "schema",
  "contract",
  "sop",
  "policy",
  "regulation",
  "training",
  "api",
  "ui",
  "report",
] as const;

export type RealizationKind = (typeof REALIZATION_KINDS)[number];

export interface KnowledgeRealizationMapping {
  /** ADR-0021 branded ID name — required on kernel entries for platform identity atoms. */
  readonly brandedId?: string;
  /** Repo-relative kernel contract path — kernel kind only; must end with `.contract.ts`. */
  readonly contractPath?: string;
  readonly notes?: string;
  readonly realizationKind: RealizationKind;
  /** Repo-relative path or external citation URI. */
  readonly reference: string;
}
