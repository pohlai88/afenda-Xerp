import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import {
  ownershipByPackage,
  ownershipContract,
} from "../data/ownership-registry.data.js";

function collectRegistryDuplicateViolations(): ArchitectureViolation[] {
  const violations: ArchitectureViolation[] = [];
  const seen = new Set<string>();

  for (const entry of ownershipContract.packages) {
    if (seen.has(entry.packageName)) {
      violations.push({
        gate: "ownership",
        packageName: entry.packageName,
        message: `duplicate ownership registry entry for ${entry.packageName}`,
      });
      continue;
    }

    seen.add(entry.packageName);
  }

  return violations;
}

export function validateOwnership(workspaces: readonly DiscoveredWorkspace[]) {
  const violations: ArchitectureViolation[] =
    collectRegistryDuplicateViolations();

  for (const workspace of workspaces) {
    const ownership = ownershipByPackage.get(workspace.packageJson.name);

    if (!ownership) {
      violations.push({
        gate: "ownership",
        packageName: workspace.packageJson.name,
        message: `no ownership entry for ${workspace.packageJson.name}`,
      });
    }
  }

  return createValidationResult(violations);
}
