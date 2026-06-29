/** PAS-004 knowledge alignment status for ERP runtime modules. */
export const KNOWLEDGE_STATUSES = [
  "accepted",
  "proposed",
  "wire_only",
  "missing",
  "ambiguous",
  "deferred",
] as const;

export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number];

export const ERP_RUNTIME_MODULE_LIFECYCLES = [
  "foundation",
  "runtime",
  "contracts_only",
] as const;

export type ErpRuntimeModuleLifecycle =
  (typeof ERP_RUNTIME_MODULE_LIFECYCLES)[number];

export const ERP_RUNTIME_MODULE_STATUSES = [
  "foundation_authorized",
  "runtime_authorized",
  "wire_only",
  "blocked",
] as const;

export type ErpRuntimeModuleStatus =
  (typeof ERP_RUNTIME_MODULE_STATUSES)[number];

export const OUTBOX_REQUIREMENTS = [
  "required",
  "not_required",
  "deferred",
  "cross_domain_required",
] as const;

export type OutboxRequirement = (typeof OUTBOX_REQUIREMENTS)[number];

export const READINESS_DIMENSIONS = [
  "authority",
  "knowledge",
  "ownership",
  "database",
  "contextSpine",
  "permissions",
  "audit",
  "outbox",
  "metadata",
  "ui",
  "tests",
  "gates",
] as const;

export type ReadinessDimension = (typeof READINESS_DIMENSIONS)[number];

export const READINESS_LEVELS = [
  "required",
  "partial",
  "deferred",
  "not_applicable",
] as const;

export type ReadinessLevel = (typeof READINESS_LEVELS)[number];

export const MODULE_OWNERSHIP_SURFACES = [
  "wireVocabulary",
  "businessMeaning",
  "runtimeBehavior",
  "databaseSchema",
  "appIngress",
  "permissionRegistry",
  "metadataBinding",
  "presentation",
] as const;

export type ModuleOwnershipSurface = (typeof MODULE_OWNERSHIP_SURFACES)[number];

export type ModuleOwnershipDefinition = Readonly<
  Record<ModuleOwnershipSurface, string>
>;

export interface ErpRuntimeModuleDefinition {
  readonly appOwner: string;
  readonly databaseOwner: string;
  readonly knowledgeOwner: string;
  readonly kvId: string;
  readonly lifecycle: ErpRuntimeModuleLifecycle;
  readonly ownerPackage: string;
  readonly permissionOwner: string;
  readonly runtimePackage: string;
  readonly runtimeStatus: ErpRuntimeModuleStatus;
  readonly slug: string;
  readonly wirePackage: string;
}

export interface ModuleKnowledgeTerm {
  readonly atomId?: string;
  readonly requiredAction: string;
  readonly status: KnowledgeStatus;
  readonly term: string;
  readonly wireArtifact?: string;
}

export interface ModuleKnowledgeMapDefinition {
  readonly kvId: string;
  readonly module: string;
  readonly terms: readonly ModuleKnowledgeTerm[];
}

export interface ModulePermissionBindingDefinition {
  readonly kernelPermissionKeys: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly registryNamespace: string;
  readonly registryPermissionKeys?: readonly string[];
}

export interface ModuleAuditMapDefinition {
  readonly actions: readonly string[];
  readonly kvId: string;
  readonly module: string;
}

export interface ModuleEventCatalogDefinition {
  readonly events: readonly string[];
  readonly module: string;
}

export interface ModuleOutboxEntry {
  readonly event: string;
  readonly notes?: string;
  readonly requirement: OutboxRequirement;
}

export interface ModuleOutboxContractDefinition {
  readonly entries: readonly ModuleOutboxEntry[];
  readonly module: string;
}

export interface ModuleMetadataSurfaceBinding {
  readonly metadataSlotId?: string;
  readonly operatingContextRequired: boolean;
  readonly permissionKey: string;
  readonly route: string;
  readonly surfaceId: string;
  readonly uiBlockReference?: string;
}

export interface ModuleMetadataBindingDefinition {
  readonly kvId: string;
  readonly module: string;
  readonly surfaces: readonly ModuleMetadataSurfaceBinding[];
}

export type ModuleReadinessMatrix = Readonly<
  Record<ReadinessDimension, ReadinessLevel>
>;

export interface ModuleReadinessDefinition {
  readonly kvId: string;
  readonly matrix: ModuleReadinessMatrix;
  readonly module: string;
}

export interface ErpModuleFoundationBundle {
  readonly auditMap: ModuleAuditMapDefinition;
  readonly eventCatalog: ModuleEventCatalogDefinition;
  readonly evidence?: Partial<Readonly<Record<ReadinessDimension, string>>>;
  readonly knowledge: ModuleKnowledgeMapDefinition;
  readonly metadataBinding: ModuleMetadataBindingDefinition;
  readonly module: ErpRuntimeModuleDefinition;
  readonly outboxContract: ModuleOutboxContractDefinition;
  readonly ownership: ModuleOwnershipDefinition;
  readonly permissionBinding: ModulePermissionBindingDefinition;
  readonly readiness: ModuleReadinessDefinition;
}

export interface ModuleReadinessAssertionResult {
  readonly checkedAt: string;
  readonly kvId: string;
  readonly module: string;
  readonly ok: true;
}

export class ModuleReadinessAssertionError extends Error {
  readonly failures: readonly string[];

  constructor(failures: readonly string[]) {
    super(
      `ERP module foundation readiness failed (${failures.length}): ${failures.join("; ")}`
    );
    this.name = "ModuleReadinessAssertionError";
    this.failures = failures;
  }
}
