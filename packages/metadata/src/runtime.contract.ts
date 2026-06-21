import { METADATA_RUNTIME_STATES } from "./metadata.constants.js";
import type {
  MetadataDensityMode,
  MetadataRuntimeState,
  PresentationMode,
} from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export type MetadataRuntimeActorId = string;
export type MetadataRuntimeTenantId = string;
export type MetadataRuntimeCompanyId = string;
export type MetadataRuntimeOrganizationId = string;
export type MetadataRuntimeWorkspaceId = string;
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
  "capability-key-carrier",
  "feature-flag-key-carrier",
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

  /**
   * Multi-tenant execution identity carriers.
   *
   * These fields describe context shape only. They do not perform data loading.
   */
  readonly tenantId?: MetadataRuntimeTenantId;
  readonly companyId?: MetadataRuntimeCompanyId;
  readonly organizationId?: MetadataRuntimeOrganizationId;
  readonly workspaceId?: MetadataRuntimeWorkspaceId;

  /**
   * Request / action correlation identity carrier.
   *
   * Actual logging and tracing belong to observability infrastructure.
   */
  readonly correlationId?: MetadataRuntimeCorrelationId;

  /**
   * Permission, capability, and feature-flag carriers.
   *
   * This package may carry already-resolved keys.
   * It must not execute permission checks or feature-flag services.
   */
  readonly permissions?: readonly MetadataRuntimePermissionKey[];
  readonly capabilities?: readonly MetadataRuntimeCapabilityKey[];
  readonly featureFlags?: readonly MetadataRuntimeFeatureFlagKey[];

  /** Metadata presentation intent. */
  readonly density: MetadataDensityMode;
  readonly presentationMode: PresentationMode;

  /** Runtime state and diagnostics intent. */
  readonly state: MetadataRuntimeState;
  readonly diagnosticsEnabled: boolean;

  /**
   * Metadata readonly intent.
   *
   * Prefer `readonlyMode` over `readonly` for clearer property semantics.
   */
  readonly readonlyMode: boolean;
}

export interface CreateMetadataRuntimeContextInput {
  readonly actorId?: MetadataRuntimeActorId;
  readonly tenantId?: MetadataRuntimeTenantId;
  readonly companyId?: MetadataRuntimeCompanyId;
  readonly organizationId?: MetadataRuntimeOrganizationId;
  readonly workspaceId?: MetadataRuntimeWorkspaceId;
  readonly correlationId?: MetadataRuntimeCorrelationId;
  readonly permissions?: readonly MetadataRuntimePermissionKey[];
  readonly capabilities?: readonly MetadataRuntimeCapabilityKey[];
  readonly featureFlags?: readonly MetadataRuntimeFeatureFlagKey[];
  readonly density?: MetadataDensityMode;
  readonly presentationMode?: PresentationMode;
  readonly state?: MetadataRuntimeState;
  readonly diagnosticsEnabled?: boolean;
  readonly readonlyMode?: boolean;
}

export interface RuntimeContract {
  readonly authority: "runtime";
  readonly version: typeof METADATA_CONTRACT_VERSION;

  /**
   * Runtime contract owns context shape only.
   *
   * It may define render context, execution context fields, runtime states,
   * diagnostics intent, correlation identity, and readonly intent.
   */
  readonly owns: readonly RuntimeContractOwnership[];

  /** Governed metadata runtime states. */
  readonly states: readonly MetadataRuntimeState[];

  /** Responsibilities explicitly forbidden from the runtime contract. */
  readonly prohibits: readonly RuntimeContractProhibition[];
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
    ...(input.actorId !== undefined ? { actorId: input.actorId } : {}),
    ...(input.tenantId !== undefined ? { tenantId: input.tenantId } : {}),
    ...(input.companyId !== undefined ? { companyId: input.companyId } : {}),
    ...(input.organizationId !== undefined
      ? { organizationId: input.organizationId }
      : {}),
    ...(input.workspaceId !== undefined
      ? { workspaceId: input.workspaceId }
      : {}),
    ...(input.correlationId !== undefined
      ? { correlationId: input.correlationId }
      : {}),
    ...(input.permissions !== undefined
      ? { permissions: input.permissions }
      : {}),
    ...(input.capabilities !== undefined
      ? { capabilities: input.capabilities }
      : {}),
    ...(input.featureFlags !== undefined
      ? { featureFlags: input.featureFlags }
      : {}),
    density: input.density ?? "default",
    presentationMode: input.presentationMode ?? "default",
    state: input.state ?? "ready",
    diagnosticsEnabled: input.diagnosticsEnabled ?? false,
    readonlyMode: input.readonlyMode ?? false,
  };
}
