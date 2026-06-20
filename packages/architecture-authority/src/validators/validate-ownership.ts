import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { ownershipByPackage } from "../data/ownership-registry.data.js";

export function validateOwnership(workspaces: readonly DiscoveredWorkspace[]) {
  const violations: ArchitectureViolation[] = [];
  const ownerCounts = new Map<string, string[]>();

  for (const workspace of workspaces) {
    const ownership = ownershipByPackage.get(workspace.packageJson.name);

    if (!ownership) {
      violations.push({
        gate: "ownership",
        packageName: workspace.packageJson.name,
        message: `no ownership entry for ${workspace.packageJson.name}`,
      });
      continue;
    }

    const owners = ownerCounts.get(workspace.packageJson.name) ?? [];
    owners.push(ownership.ownerDomain);
    ownerCounts.set(workspace.packageJson.name, owners);
  }

  for (const [packageName, owners] of ownerCounts) {
    if (owners.length > 1) {
      violations.push({
        gate: "ownership",
        packageName,
        message: `multiple owners for ${packageName}`,
      });
    }
  }

  return createValidationResult(violations);
}
