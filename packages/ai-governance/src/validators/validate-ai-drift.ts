import type { AiViolation } from "../contracts/ai-change.contract.js";
import {
  containsUnsafeSuppression,
  hasSuppressionRationale,
  isSuppressionExempted,
} from "../policies/ai-drift-policy.js";
import type { AiGovernanceContext } from "./validate-ai-change.js";

export function validateAiDrift(context: AiGovernanceContext): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];

  for (const changedLine of context.changedLines) {
    if (!containsUnsafeSuppression(changedLine.content)) {
      continue;
    }

    if (
      isSuppressionExempted(
        changedLine.path,
        context.scopeManifest.testExemptions
      )
    ) {
      continue;
    }

    if (hasSuppressionRationale(changedLine.content)) {
      continue;
    }

    violations.push({
      invariant: "AI-010",
      gate: "drift",
      message: "new unsafe suppression on changed line without TIP/ADR rationale",
      path: changedLine.path,
      lineNumber: changedLine.lineNumber,
    });
  }

  return violations;
}
