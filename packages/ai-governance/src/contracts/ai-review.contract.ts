export const AI_REVIEW_CHECKLIST_ITEMS = [
  "architecture-authority-passes",
  "scope-manifest-present",
  "scope-not-overbroad",
  "no-forbidden-package-patterns",
  "public-exports-respected",
  "tests-or-exemptions-documented",
  "deletions-justified",
  "no-new-unsafe-suppressions",
  "contracts-adr-backed",
] as const;

export type AiReviewChecklistItem = (typeof AI_REVIEW_CHECKLIST_ITEMS)[number];

export interface AiReviewChecklistEntry {
  readonly id: AiReviewChecklistItem;
  readonly label: string;
  readonly invariant: string;
}
