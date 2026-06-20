// biome-ignore-all lint/performance/noBarrelFile: package root is the curated public API surface.

export {
  AI_INVARIANT_IDS,
  createAiValidationResult,
  mergeAiValidationResults,
} from "./contracts/ai-change.contract.js";
export type {
  AiChangeScopeManifest,
  AiGovernanceGate,
  AiGovernanceMode,
  AiInvariantId,
  AiValidationResult,
  AiViolation,
  ChangedLine,
  DeletionJustification,
  PackageExportMap,
  TestExemption,
} from "./contracts/ai-change.contract.js";
export {
  BUSINESS_LOGIC_FORBIDDEN_LAYERS,
  FORBIDDEN_AI_PACKAGE_PATTERNS,
  FORBIDDEN_BROAD_SCOPE_GLOBS,
} from "./contracts/ai-boundary.contract.js";
export {
  AI_REVIEW_CHECKLIST_ITEMS,
} from "./contracts/ai-review.contract.js";
export type {
  AiReviewChecklistEntry,
  AiReviewChecklistItem,
} from "./contracts/ai-review.contract.js";
export {
  AI_GOVERNANCE_FINGERPRINT,
  AI_GOVERNANCE_VERSION,
  UNSAFE_SUPPRESSION_PATTERNS,
} from "./contracts/ai-drift.contract.js";
export type { AiDriftIndicator } from "./contracts/ai-drift.contract.js";
export type { InvariantPolicy } from "./policies/ai-change-policy.js";
export { AI_INVARIANT_POLICIES } from "./policies/ai-change-policy.js";
export { AI_REVIEW_CHECKLIST } from "./policies/ai-review-policy.js";
export { buildAiGovernanceReport } from "./reports/ai-governance-report.js";
export type { AiGovernanceReport } from "./reports/ai-governance-report.js";
export type { AiGovernanceContext } from "./validators/validate-ai-change.js";
export { validateAiGovernance } from "./validators/validate-ai-governance.js";
export { validateAiBoundaries } from "./validators/validate-ai-boundaries.js";
export { validateAiChangeGates } from "./validators/validate-ai-change.js";
export { validateAiDrift } from "./validators/validate-ai-drift.js";
export { validateAiPrompts } from "./validators/validate-ai-prompts.js";
export { matchesGlob, pathMatchesAnyGlob } from "./utils/glob.js";
