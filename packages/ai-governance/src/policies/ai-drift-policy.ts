import { UNSAFE_SUPPRESSION_PATTERNS } from "../contracts/ai-drift.contract.js";
import { SUPPRESSION_RATIONALE_PATTERN } from "./ai-prompt-policy.js";

export { UNSAFE_SUPPRESSION_PATTERNS };

export function containsUnsafeSuppression(content: string): boolean {
  return UNSAFE_SUPPRESSION_PATTERNS.some((pattern) => content.includes(pattern));
}

export function hasSuppressionRationale(content: string): boolean {
  return SUPPRESSION_RATIONALE_PATTERN.test(content);
}

export function isSuppressionExempted(
  path: string,
  testExemptions: readonly { readonly path: string; readonly rationale: string }[]
): boolean {
  return testExemptions.some(
    (entry) => entry.path === path && entry.rationale.length > 0
  );
}
