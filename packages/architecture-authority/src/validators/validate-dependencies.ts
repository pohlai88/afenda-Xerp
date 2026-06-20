import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { dependencyContract } from "../data/dependency-registry.data.js";
import { getRuntimeWorkspaceDependencies } from "../workspace/discover-workspaces.js";

export function validateDependencies(
  workspaces: readonly DiscoveredWorkspace[]
) {
  const violations: ArchitectureViolation[] = [];

  for (const workspace of workspaces) {
    const packageName = workspace.packageJson.name;
    const approved =
      dependencyContract.approvedRuntimeByPackage[packageName] ?? [];
    const approvedSet = new Set(approved);
    const runtimeDeps = getRuntimeWorkspaceDependencies(workspace.packageJson);

    for (const dependency of runtimeDeps) {
      if (!approvedSet.has(dependency)) {
        violations.push({
          gate: "dependencies",
          packageName,
          message: `unapproved runtime dependency ${packageName} → ${dependency}`,
        });
      }
    }

    for (const dependency of approved) {
      if (!runtimeDeps.includes(dependency)) {
        violations.push({
          gate: "dependencies",
          packageName,
          message: `declared dependency missing from package.json: ${packageName} → ${dependency}`,
        });
      }
    }
  }

  return createValidationResult(violations);
}
