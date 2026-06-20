import { FORBIDDEN_PACKAGE_NAME_PATTERNS } from "../contracts/lifecycle.contract.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import {
  packageByName,
  packageContract,
} from "../data/package-registry.data.js";

export function validateRegistry(workspaces: readonly DiscoveredWorkspace[]) {
  const violations: ArchitectureViolation[] = [];
  const discoveredNames = new Set(workspaces.map((ws) => ws.packageJson.name));

  for (const workspace of workspaces) {
    const registryEntry = packageByName.get(workspace.packageJson.name);

    if (!registryEntry) {
      violations.push({
        gate: "registry",
        packageName: workspace.packageJson.name,
        message: `unregistered workspace package ${workspace.packageJson.name}`,
      });
      continue;
    }

    if (
      registryEntry.lifecycle !== "active" &&
      registryEntry.lifecycle !== "active-exempt" &&
      registryEntry.lifecycle !== "experimental"
    ) {
      violations.push({
        gate: "registry",
        packageName: workspace.packageJson.name,
        message: `package ${workspace.packageJson.name} has lifecycle ${registryEntry.lifecycle} but exists on filesystem`,
      });
    }

    for (const pattern of FORBIDDEN_PACKAGE_NAME_PATTERNS) {
      if (pattern.test(workspace.directoryName)) {
        violations.push({
          gate: "registry",
          packageName: workspace.packageJson.name,
          message: `forbidden package directory name pattern: ${workspace.directoryName}`,
        });
      }
    }
  }

  for (const registryEntry of packageContract.packages) {
    if (!registryEntry.filesystemRequired) {
      continue;
    }

    if (!discoveredNames.has(registryEntry.packageName)) {
      violations.push({
        gate: "registry",
        packageName: registryEntry.packageName,
        message: `registered package ${registryEntry.packageName} (${registryEntry.registryId}) missing from filesystem`,
      });
    }
  }

  return createValidationResult(violations);
}
