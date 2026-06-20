import {
  ARCHITECTURE_AUTHORITY_VERSION,
  ARCHITECTURE_BASELINE_FINGERPRINT,
} from "../contracts/architecture-authority-version.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { dependencyContract } from "../data/dependency-registry.data.js";
import { exceptionContract } from "../data/exception-registry.data.js";
import { layerContract } from "../data/layer-registry.data.js";
import { ownershipContract } from "../data/ownership-registry.data.js";
import { packageContract } from "../data/package-registry.data.js";
import { validateArchitecture } from "../validators/validate-architecture.js";

export interface ArchitectureReport {
  readonly dependencies: typeof dependencyContract.runtimeEdges;
  readonly exceptions: typeof exceptionContract.exceptions;
  readonly fingerprint: string;
  readonly generatedAt: string;
  readonly layers: typeof layerContract.assignments;
  readonly ownership: typeof ownershipContract.packages;
  readonly packageCount: number;
  readonly packages: typeof packageContract.packages;
  readonly validation: ReturnType<typeof validateArchitecture>;
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
