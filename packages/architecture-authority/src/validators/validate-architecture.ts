import {
  mergeValidationResults,
  type ValidationResult,
} from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { validateArchitectureGovernanceAmendment } from "./validate-architecture-governance-amendment.js";
import { validateCycles } from "./validate-cycles.js";
import { validateDependencies } from "./validate-dependencies.js";
import { validateExceptions } from "./validate-exceptions.js";
import { validateForbiddenDependencies } from "./validate-forbidden-dependencies.js";
import { validateFoundationDisposition } from "./validate-foundation-disposition.js";
import { validateLayers } from "./validate-layers.js";
import { validateLifecycle } from "./validate-lifecycle.js";
import { validateOwnership } from "./validate-ownership.js";
import { validateRegistry } from "./validate-registry.js";

export function validateArchitecture(
  workspaces: readonly DiscoveredWorkspace[]
): ValidationResult {
  const results = [
    validateRegistry(workspaces),
    validateOwnership(workspaces),
    validateLayers(workspaces),
    validateDependencies(workspaces),
    validateForbiddenDependencies(workspaces),
    validateCycles(workspaces),
    validateExceptions(),
    validateFoundationDisposition(),
    validateLifecycle(),
    validateArchitectureGovernanceAmendment(),
  ];

  return mergeValidationResults(results);
}
