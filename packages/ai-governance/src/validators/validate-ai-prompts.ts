import type { AiViolation } from "../contracts/ai-change.contract.js";
import type { AiGovernanceContext } from "./validate-ai-change.js";

function isNonEmptyStringArray(value: readonly string[]): boolean {
  return value.length > 0 && value.every((entry) => entry.trim().length > 0);
}

export function validateAiPrompts(context: AiGovernanceContext): AiViolation[] {
  if (context.mode !== "scope" || !context.scopeManifest) {
    return [];
  }

  const violations: AiViolation[] = [];
  const manifest = context.scopeManifest;

  if (!manifest.tip.trim()) {
    violations.push({
      invariant: "AI-004",
      gate: "prompt",
      message: "scope manifest tip must not be empty",
    });
  }

  if (!manifest.adr.trim()) {
    violations.push({
      invariant: "AI-007",
      gate: "prompt",
      message: "scope manifest adr must not be empty",
    });
  }

  if (!manifest.reason.trim()) {
    violations.push({
      invariant: "AI-004",
      gate: "prompt",
      message: "scope manifest reason must not be empty",
    });
  }

  if (!isNonEmptyStringArray(manifest.nonGoals)) {
    violations.push({
      invariant: "AI-004",
      gate: "prompt",
      message: "scope manifest nonGoals must be a non-empty string array",
    });
  }

  if (!isNonEmptyStringArray(manifest.testPlan)) {
    violations.push({
      invariant: "AI-008",
      gate: "prompt",
      message: "scope manifest testPlan must be a non-empty string array",
    });
  }

  return violations;
}
