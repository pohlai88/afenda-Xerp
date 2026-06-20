import type { AiReviewChecklistEntry } from "../contracts/ai-review.contract.js";

export const AI_REVIEW_CHECKLIST: readonly AiReviewChecklistEntry[] = [
  {
    id: "architecture-authority-passes",
    label: "Architecture authority gates pass",
    invariant: "AI-001, AI-002",
  },
  {
    id: "scope-manifest-present",
    label: "PR includes .tip-scope.json",
    invariant: "AI-004",
  },
  {
    id: "scope-not-overbroad",
    label: "Scope globs are narrow and ADR-backed when broad",
    invariant: "AI-004-SCOPE",
  },
  {
    id: "no-forbidden-package-patterns",
    label: "No forbidden package directory patterns",
    invariant: "AI-003",
  },
  {
    id: "public-exports-respected",
    label: "Imports use public package entrypoints only",
    invariant: "AI-006",
  },
  {
    id: "tests-or-exemptions-documented",
    label: "New source files have tests or testExemptions",
    invariant: "AI-008",
  },
  {
    id: "deletions-justified",
    label: "Deletions documented in deletionJustifications",
    invariant: "AI-009",
  },
  {
    id: "no-new-unsafe-suppressions",
    label: "No new unsafe suppressions on changed lines",
    invariant: "AI-010",
  },
  {
    id: "contracts-adr-backed",
    label: "Contract edits backed by scope ADR",
    invariant: "AI-007",
  },
];
