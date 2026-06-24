export {
  ARCHITECTURE_AUTHORITY_VERSION,
  ARCHITECTURE_BASELINE_FINGERPRINT,
} from "./contracts/architecture-authority-version.js";
export type {
  DependencyClassification,
  DependencyContract,
  DependencyEdge,
} from "./contracts/dependency.contract.js";
export type {
  ArchitectureException,
  ExceptionContract,
} from "./contracts/exception.contract.js";
export type {
  FoundationDispositionEntry,
  FoundationDispositionRegistry,
  FoundationLane,
} from "./contracts/foundation-disposition.contract.js";
export { FOUNDATION_LANES } from "./contracts/foundation-disposition.contract.js";
export type { LayerContract } from "./contracts/layer.contract.js";
export type {
  LifecycleContract,
  LifecycleState,
} from "./contracts/lifecycle.contract.js";
export type {
  AuthorityLevel,
  OwnershipAuditRow,
  OwnershipContract,
  PackageOwnership,
} from "./contracts/ownership.contract.js";
export type {
  ArchitectureLayer,
  PackageContract,
  PackageDefinition,
  PackageRegistryStatus,
} from "./contracts/package.contract.js";
export type {
  ArchitectureViolation,
  ValidationGate,
  ValidationResult,
} from "./contracts/validation-result.contract.js";
export { createValidationResult } from "./contracts/validation-result.contract.js";
export type {
  DiscoveredWorkspace,
  WorkspacePackageJson,
} from "./contracts/workspace.contract.js";
export { dependencyContract } from "./data/dependency-registry.data.js";
export { exceptionContract } from "./data/exception-registry.data.js";
export {
  FOUNDATION_DISPOSITION_FINGERPRINT,
  FOUNDATION_DISPOSITION_REGISTRY,
  foundationDispositionRegistry,
  getFoundationDispositionEntriesByLane,
  getFoundationDispositionEntry,
} from "./data/foundation-disposition.registry.js";
export {
  getPackageLayer,
  isLayerDependencyAllowed,
  layerContract,
} from "./data/layer-registry.data.js";
export { lifecycleContract } from "./data/lifecycle-registry.data.js";
export {
  ownershipByPackage,
  ownershipContract,
} from "./data/ownership-registry.data.js";
export {
  packageByName,
  packageContract,
} from "./data/package-registry.data.js";
export type { ArchitectureReport } from "./reports/build-architecture-report.js";
export { buildArchitectureReport } from "./reports/build-architecture-report.js";
export {
  buildDependencySnapshot,
  type DependencySnapshot,
  runtimeEdgesMatch,
} from "./reports/build-dependency-snapshot.js";
export { buildOwnershipAuditMarkdown } from "./reports/build-ownership-audit.js";
export {
  ARCHITECTURE_AUTHORITY_CANONICAL_DOCS,
  ARCHITECTURE_AUTHORITY_DATA_MODULES,
  ARCHITECTURE_AUTHORITY_SURFACE_RULE,
  MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES,
} from "./surface/index.js";
export { validateArchitecture } from "./validators/validate-architecture.js";
export { validateCycles } from "./validators/validate-cycles.js";
export { validateDependencies } from "./validators/validate-dependencies.js";
export {
  validateExceptionEntries,
  validateExceptions,
} from "./validators/validate-exceptions.js";
export { validateForbiddenDependencies } from "./validators/validate-forbidden-dependencies.js";
export { validateFoundationDisposition } from "./validators/validate-foundation-disposition.js";
export { validateLayers } from "./validators/validate-layers.js";
export {
  findMissingOwnershipViolations,
  validateOwnership,
} from "./validators/validate-ownership.js";
export { validateRegistry } from "./validators/validate-registry.js";
export {
  discoverWorkspaces,
  getDevWorkspaceDependencies,
  getRuntimeWorkspaceDependencies,
  parseWorkspacePackageJson,
} from "./workspace/discover-workspaces.js";
