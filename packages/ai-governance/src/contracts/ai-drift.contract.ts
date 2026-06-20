export const AI_GOVERNANCE_VERSION = "1.0.0" as const;

export const AI_GOVERNANCE_FINGERPRINT =
  "AI-GOV-BASELINE-2026-06-20-v1" as const;

export const UNSAFE_SUPPRESSION_PATTERNS = [
  "@ts-ignore",
  "@ts-nocheck",
  "@ts-expect-error",
  "eslint-disable",
  "biome-ignore",
] as const;

export type AiDriftIndicator =
  | "unscoped-file-change"
  | "broad-scope-glob"
  | "forbidden-package-name"
  | "new-unsafe-suppression"
  | "contract-edit-without-adr"
  | "missing-test-coverage"
  | "undeclared-deletion";
