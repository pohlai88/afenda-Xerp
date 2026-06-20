import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { isLayerDependencyAllowed } from "../data/layer-registry.data.js";
import { packageByName } from "../data/package-registry.data.js";
import { getRuntimeWorkspaceDependencies } from "../workspace/discover-workspaces.js";

export function validateForbiddenDependencies(
  workspaces: readonly DiscoveredWorkspace[]
) {
  const violations: ArchitectureViolation[] = [];

  for (const workspace of workspaces) {
    const fromName = workspace.packageJson.name;
    const fromEntry = packageByName.get(fromName);

    if (fromEntry?.layerDepExempt) {
      continue;
    }

    const fromLayer = fromEntry?.layer;
    if (!fromLayer) {
      continue;
    }

    for (const toName of getRuntimeWorkspaceDependencies(
      workspace.packageJson
    )) {
      const toLayer = packageByName.get(toName)?.layer;
      if (!toLayer) {
        continue;
      }

      if (!isLayerDependencyAllowed(fromLayer, toLayer)) {
        violations.push({
          gate: "forbidden-dependencies",
          packageName: fromName,
          message: `forbidden layer dependency ${fromName} (${fromLayer}) → ${toName} (${toLayer})`,
        });
      }
    }
  }

  return createValidationResult(violations);
}
