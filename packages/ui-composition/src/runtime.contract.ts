import { METADATA_RUNTIME_STATES } from "./metadata.constants.js";
import type {
  MetadataDensityMode,
  MetadataRuntimeState,
  PresentationMode,
} from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";
import type { MetadataRuntimePermissionModelDescriptor } from "./metadata-permission-vocabulary.contract.js";
import type { MetadataRuntimePolicyDecision } from "./metadata-policy-vocabulary.contract.js";

export type MetadataRuntimeActorId = string;
export type MetadataRuntimeTenantId = string;
export type MetadataRuntimeCompanyId = string;
export type MetadataRuntimeOrganizationId = string;
export type MetadataRuntimeEntityGroupId = string;
export type MetadataRuntimeTeamId = string;
export type MetadataRuntimeProjectId = string;
export type MetadataRuntimeWorkspaceId = string;
export type MetadataRuntimeSurfaceId = string;
export type MetadataRuntimeWorkflowId = string;
export type MetadataRuntimeConsolidationReportingDate = string;
export type MetadataRuntimePermissionGrantScopeType = string;
export type MetadataRuntimeCorrelationId = string;
export type MetadataRuntimePermissionKey = string;
export type MetadataRuntimeCapabilityKey = string;
export type MetadataRuntimeFeatureFlagKey = string;

export const RUNTIME_CONTRACT_OWNERSHIPS = [
  "metadata-render-context",
  "execution-context-shape",
  "runtime-state",
  "diagnostics-flag",
  "correlation-identity",
  "readonly-mode",
  "permission-key-carrier",
  "permission-model-descriptor-carrier",
  "capability-key-carrier",
  "feature-flag-key-carrier",
  "policy-decision-carrier",
] as const;

export type RuntimeContractOwnership =
  (typeof RUNTIME_CONTRACT_OWNERSHIPS)[number];

export const RUNTIME_CONTRACT_PROHIBITIONS = [
  "permission-execution",
  "policy-execution",
  "database-access",
  "auth-services",
  "observability-services",
  "business-logic",
  "server-actions",
  "react-components",
  "ui-implementation",
  "renderer-implementation",
] as const;

export type RuntimeContractProhibition =
  (typeof RUNTIME_CONTRACT_PROHIBITIONS)[number];

export interface MetadataRuntimeContext {
  /**
   * Actor identity carrier only.
   *
   * This contract does not authenticate, authorize, or load the actor.
   */
  readonly actorId?: MetadataRuntimeActorId;
  readonly capabilities?: readonly MetadataRuntimeCapabilityKey[];
  readonly companyId?: MetadataRuntimeCompanyId;
  readonly consolidationReportingDate?: MetadataRuntimeConsolidationReportingDate;

  /**
   * Request / action correlation identity carrier.
   *
   * Actual logging and tracing belong to observability infrastructure.
   */
  readonly correlationId?: MetadataRuntimeCorrelationId;

  /** Metadata presentation intent. */
  readonly density: MetadataDensityMode;
  readonly diagnosticsEnabled: boolean;
  readonly entityGroupId?: MetadataRuntimeEntityGroupId;
  readonly featureFlags?: readonly MetadataRuntimeFeatureFlagKey[];
  readonly organizationId?: MetadataRuntimeOrganizationId;
  readonly ownershipInterestCount?: number;
  readonly permissionGrantScopeType?: MetadataRuntimePermissionGrantScopeType;
  readonly permissionModelDescriptors?: readonly MetadataRuntimePermissionModelDescriptor[];

  /**
   * Permission, capability, and feature-flag carriers.
   *
   * This package may carry already-resolved keys.
   * It must not execute permission checks or feature-flag services.
   */
  readonly permissions?: readonly MetadataRuntimePermissionKey[];
  readonly policyDecision?: MetadataRuntimePolicyDecision;
  readonly presentationMode: PresentationMode;
  readonly projectId?: MetadataRuntimeProjectId;

  /**
   * Metadata readonly intent.
   *
   * Prefer `readonlyMode` over `readonly` for clearer property semantics.
   */
  readonly readonlyMode: boolean;

  /** Runtime state and diagnostics intent. */
  readonly state: MetadataRuntimeState;
  readonly surfaceId?: MetadataRuntimeSurfaceId;

  /**
   * Multi-tenant execution identity carriers.
   *
   * These fields describe context shape only. They do not perform data loading.
   */
  readonly teamId?: MetadataRuntimeTeamId;
  readonly tenantId?: MetadataRuntimeTenantId;
  readonly workflowId?: MetadataRuntimeWorkflowId;
  readonly workspaceId?: MetadataRuntimeWorkspaceId;
}

export interface CreateMetadataRuntimeContextInput {
  readonly actorId?: MetadataRuntimeActorId;
  readonly capabilities?: readonly MetadataRuntimeCapabilityKey[];
  readonly companyId?: MetadataRuntimeCompanyId;
  readonly consolidationReportingDate?: MetadataRuntimeConsolidationReportingDate;
  readonly correlationId?: MetadataRuntimeCorrelationId;
  readonly density?: MetadataDensityMode;
  readonly diagnosticsEnabled?: boolean;
  readonly entityGroupId?: MetadataRuntimeEntityGroupId;
  readonly featureFlags?: readonly MetadataRuntimeFeatureFlagKey[];
  readonly organizationId?: MetadataRuntimeOrganizationId;
  readonly ownershipInterestCount?: number;
  readonly permissionGrantScopeType?: MetadataRuntimePermissionGrantScopeType;
  readonly permissionModelDescriptors?: readonly MetadataRuntimePermissionModelDescriptor[];
  readonly permissions?: readonly MetadataRuntimePermissionKey[];
  readonly policyDecision?: MetadataRuntimePolicyDecision;
  readonly presentationMode?: PresentationMode;
  readonly projectId?: MetadataRuntimeProjectId;
  readonly readonlyMode?: boolean;
  readonly state?: MetadataRuntimeState;
  readonly surfaceId?: MetadataRuntimeSurfaceId;
  readonly teamId?: MetadataRuntimeTeamId;
  readonly tenantId?: MetadataRuntimeTenantId;
  readonly workflowId?: MetadataRuntimeWorkflowId;
  readonly workspaceId?: MetadataRuntimeWorkspaceId;
}

export interface RuntimeContract {
  readonly authority: "runtime";

  /**
   * Runtime contract owns context shape only.
   *
   * It may define render context, execution context fields, runtime states,
   * diagnostics intent, correlation identity, and readonly intent.
   */
  readonly owns: readonly RuntimeContractOwnership[];

  /** Responsibilities explicitly forbidden from the runtime contract. */
  readonly prohibits: readonly RuntimeContractProhibition[];

  /** Governed metadata runtime states. */
  readonly states: readonly MetadataRuntimeState[];
  readonly version: typeof METADATA_CONTRACT_VERSION;
}

export const runtimeContract = {
  authority: "runtime",
  version: METADATA_CONTRACT_VERSION,

  owns: RUNTIME_CONTRACT_OWNERSHIPS,

  states: METADATA_RUNTIME_STATES,

  prohibits: RUNTIME_CONTRACT_PROHIBITIONS,
} as const satisfies RuntimeContract;

export function createMetadataRuntimeContext(
  input: CreateMetadataRuntimeContextInput = {}
): MetadataRuntimeContext {
  return {
    ...(input.actorId === undefined ? {} : { actorId: input.actorId }),
    ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
    ...(input.companyId === undefined ? {} : { companyId: input.companyId }),
    ...(input.organizationId === undefined
      ? {}
      : { organizationId: input.organizationId }),
    ...(input.entityGroupId === undefined
      ? {}
      : { entityGroupId: input.entityGroupId }),
    ...(input.teamId === undefined ? {} : { teamId: input.teamId }),
    ...(input.projectId === undefined ? {} : { projectId: input.projectId }),
    ...(input.workspaceId === undefined
      ? {}
      : { workspaceId: input.workspaceId }),
    ...(input.surfaceId === undefined ? {} : { surfaceId: input.surfaceId }),
    ...(input.workflowId === undefined ? {} : { workflowId: input.workflowId }),
    ...(input.consolidationReportingDate === undefined
      ? {}
      : { consolidationReportingDate: input.consolidationReportingDate }),
    ...(input.permissionGrantScopeType === undefined
      ? {}
      : { permissionGrantScopeType: input.permissionGrantScopeType }),
    ...(input.ownershipInterestCount === undefined
      ? {}
      : { ownershipInterestCount: input.ownershipInterestCount }),
    ...(input.correlationId === undefined
      ? {}
      : { correlationId: input.correlationId }),
    ...(input.permissions === undefined
      ? {}
      : { permissions: input.permissions }),
    ...(input.permissionModelDescriptors === undefined
      ? {}
      : { permissionModelDescriptors: input.permissionModelDescriptors }),
    ...(input.policyDecision === undefined
      ? {}
      : { policyDecision: input.policyDecision }),
    ...(input.capabilities === undefined
      ? {}
      : { capabilities: input.capabilities }),
    ...(input.featureFlags === undefined
      ? {}
      : { featureFlags: input.featureFlags }),
    density: input.density ?? "default",
    presentationMode: input.presentationMode ?? "default",
    state: input.state ?? "ready",
    diagnosticsEnabled: input.diagnosticsEnabled ?? false,
    readonlyMode: input.readonlyMode ?? false,
  };
}
