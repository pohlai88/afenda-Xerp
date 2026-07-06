import { FORBIDDEN_PACKAGE_NAME_PATTERNS } from "../contracts/lifecycle.contract.js";
import type { PackageDefinition } from "../contracts/package.contract.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import {
  packageByName,
  packageContract,
} from "../data/package-registry.data.js";

const SHADOW_VERSION_PACKAGE_PATTERN = /-v\d+$/u;

/** Lifecycles permitted to remain on workspace filesystem (ADR-0006 · ADR-0040). */
const FILESYSTEM_PRESENT_LIFECYCLES = new Set([
  "active",
  "active-exempt",
  "experimental",
  "deprecated",
]);

/** ADR-0040 canonical promotion — retains `-v2` directory until housekeeping rename. */
const CANONICAL_SHADOW_VERSION_PACKAGES = new Set(["@afenda/shadcn-studio-v2"]);

function allowsShadowVersionDirectory(
  packageName: string,
  lifecycle: PackageDefinition["lifecycle"],
  directoryName: string
): boolean {
  if (!SHADOW_VERSION_PACKAGE_PATTERN.test(directoryName)) {
    return true;
  }

  if (lifecycle === "experimental") {
    return true;
  }

  return (
    lifecycle === "active" && CANONICAL_SHADOW_VERSION_PACKAGES.has(packageName)
  );
}

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

    if (!FILESYSTEM_PRESENT_LIFECYCLES.has(registryEntry.lifecycle)) {
      violations.push({
        gate: "registry",
        packageName: workspace.packageJson.name,
        message: `package ${workspace.packageJson.name} has lifecycle ${registryEntry.lifecycle} but exists on filesystem`,
      });
    }

    for (const pattern of FORBIDDEN_PACKAGE_NAME_PATTERNS) {
      if (pattern.test(workspace.directoryName)) {
        if (
          allowsShadowVersionDirectory(
            registryEntry.packageName,
            registryEntry.lifecycle,
            workspace.directoryName
          )
        ) {
          continue;
        }

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
