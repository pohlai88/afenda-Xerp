import type { PackageOwnership } from "../contracts/ownership.contract.js";
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

export function findMissingOwnershipViolations(
  packageNames: readonly string[],
  ownershipLookup: ReadonlyMap<string, PackageOwnership>
): ArchitectureViolation[] {
  const violations: ArchitectureViolation[] = [];

  for (const packageName of packageNames) {
    if (!ownershipLookup.has(packageName)) {
      violations.push({
        gate: "ownership",
        packageName,
        message: `no ownership entry for ${packageName}`,
      });
    }
  }

  return violations;
}

export function validateOwnership(workspaces: readonly DiscoveredWorkspace[]) {
  const violations: ArchitectureViolation[] =
    collectRegistryDuplicateViolations();

  violations.push(
    ...findMissingOwnershipViolations(
      workspaces.map((workspace) => workspace.packageJson.name),
      ownershipByPackage
    )
  );

  return createValidationResult(violations);
}
