import { createAiValidationResult } from "../contracts/ai-change.contract.js";
import type { AiGovernanceContext } from "./validate-ai-change.js";
import { validateAiChangeGates } from "./validate-ai-change.js";
import { validateAiBoundaries } from "./validate-ai-boundaries.js";
import { validateAiPrompts } from "./validate-ai-prompts.js";
import { validateAiDrift } from "./validate-ai-drift.js";

export function validateAiGovernance(context: AiGovernanceContext) {
  return createAiValidationResult(context.mode, [
    ...validateAiChangeGates(context),
    ...validateAiBoundaries(context),
    ...validateAiPrompts(context),
    ...validateAiDrift(context),
  ]);
}
