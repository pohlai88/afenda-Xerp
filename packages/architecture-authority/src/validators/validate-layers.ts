import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { getPackageLayer } from "../data/layer-registry.data.js";
import { packageByName } from "../data/package-registry.data.js";

export function validateLayers(workspaces: readonly DiscoveredWorkspace[]) {
  const violations: ArchitectureViolation[] = [];

  for (const workspace of workspaces) {
    const packageName = workspace.packageJson.name;
    const registryLayer = packageByName.get(packageName)?.layer;
    const assignmentLayer = getPackageLayer(packageName);

    if (!assignmentLayer) {
      violations.push({
        gate: "layers",
        packageName,
        message: `no layer assignment for ${packageName}`,
      });
      continue;
    }

    if (registryLayer && registryLayer !== assignmentLayer) {
      violations.push({
        gate: "layers",
        packageName,
        message: `layer mismatch for ${packageName}: registry=${registryLayer} assignment=${assignmentLayer}`,
      });
    }
  }

  return createValidationResult(violations);
}
