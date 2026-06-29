import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import {
  createValidationResult,
  type ValidationResult,
} from "../contracts/validation-result.contract.js";
import { architectureAuthorityRepoRoot } from "../data/export-surface-attestation.build.js";
import { validateArchitectureGovernanceAmendment } from "./validate-architecture-governance-amendment.js";

const GOLDEN_PATH_SCAFFOLD_GATE = "golden-path-scaffold" as const;

/** Markers enforced in scripts/scaffold-package.mjs — gate fails if any are removed. */
export const GOLDEN_PATH_SCAFFOLD_POLICY_MARKERS = [
  "business-master-data-scaffold-dirs",
  "package-registry.data.ts",
  "Delegate registry rows to foundation-registry-owner",
  "--pas",
  "check:business-master-data-scaffold",
] as const;

export function validateGoldenPathScaffoldPolicy(): ValidationResult {
  const scaffoldPath = join(
    architectureAuthorityRepoRoot,
    "scripts/scaffold-package.mjs"
  );
  const content = readFileSync(scaffoldPath, "utf8");
  const violations: ArchitectureViolation[] = [];

  for (const marker of GOLDEN_PATH_SCAFFOLD_POLICY_MARKERS) {
    if (!content.includes(marker)) {
      violations.push({
        gate: GOLDEN_PATH_SCAFFOLD_GATE,
        message: `scaffold-package.mjs missing golden-path policy marker: ${marker}`,
      });
    }
  }

  const amendmentResult = validateArchitectureGovernanceAmendment();
  if (!amendmentResult.ok) {
    violations.push({
      gate: GOLDEN_PATH_SCAFFOLD_GATE,
      message:
        "golden-path catalog incomplete — architecture governance amendment validation failed",
    });
  }

  return createValidationResult(violations);
}
