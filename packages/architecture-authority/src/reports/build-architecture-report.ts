import {
  ARCHITECTURE_AUTHORITY_VERSION,
  ARCHITECTURE_BASELINE_FINGERPRINT,
} from "../contracts/architecture-authority-version.js";
import type { DependencyEdge } from "../contracts/dependency.contract.js";
import type { ArchitectureException } from "../contracts/exception.contract.js";
import type { PackageOwnership } from "../contracts/ownership.contract.js";
import type {
  ArchitectureLayer,
  PackageDefinition,
} from "../contracts/package.contract.js";
import type { ValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { dependencyContract } from "../data/dependency-registry.data.js";
import { exceptionContract } from "../data/exception-registry.data.js";
import { layerContract } from "../data/layer-registry.data.js";
import { ownershipContract } from "../data/ownership-registry.data.js";
import { packageContract } from "../data/package-registry.data.js";
import { validateArchitecture } from "../validators/validate-architecture.js";

export interface ArchitectureReport {
  readonly dependencies: readonly DependencyEdge[];
  readonly exceptions: readonly ArchitectureException[];
  readonly fingerprint: string;
  readonly generatedAt: string;
  readonly layers: Readonly<Record<string, ArchitectureLayer>>;
  readonly ownership: readonly PackageOwnership[];
  readonly packageCount: number;
  readonly packages: readonly PackageDefinition[];
  readonly validation: ValidationResult;
  readonly version: string;
}

export function buildArchitectureReport(
  workspaces: readonly DiscoveredWorkspace[]
): ArchitectureReport {
  return {
    version: ARCHITECTURE_AUTHORITY_VERSION,
    fingerprint: ARCHITECTURE_BASELINE_FINGERPRINT,
    generatedAt: new Date().toISOString(),
    packageCount: workspaces.length,
    packages: packageContract.packages,
    ownership: ownershipContract.packages,
    layers: layerContract.assignments,
    dependencies: dependencyContract.runtimeEdges,
    exceptions: exceptionContract.exceptions,
    validation: validateArchitecture(workspaces),
  };
}
