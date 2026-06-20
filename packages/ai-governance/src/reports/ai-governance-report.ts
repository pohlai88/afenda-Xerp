import {
  AI_GOVERNANCE_FINGERPRINT,
  AI_GOVERNANCE_VERSION,
} from "../contracts/ai-drift.contract.js";
import type { AiGovernanceContext } from "../validators/validate-ai-change.js";
import { validateAiGovernance } from "../validators/validate-ai-governance.js";

export interface AiGovernanceReport {
  readonly version: typeof AI_GOVERNANCE_VERSION;
  readonly fingerprint: typeof AI_GOVERNANCE_FINGERPRINT;
  readonly mode: AiGovernanceContext["mode"];
  readonly tip: string | null;
  readonly adr: string | null;
  readonly changedFileCount: number;
  readonly validation: ReturnType<typeof validateAiGovernance>;
}

export function buildAiGovernanceReport(
  context: AiGovernanceContext
): AiGovernanceReport {
  return {
    version: AI_GOVERNANCE_VERSION,
    fingerprint: AI_GOVERNANCE_FINGERPRINT,
    mode: context.mode,
    tip: context.scopeManifest?.tip ?? null,
    adr: context.scopeManifest?.adr ?? null,
    changedFileCount: context.changedFiles.length,
    validation: validateAiGovernance(context),
  };
}
