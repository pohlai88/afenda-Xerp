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
  "contracts_only",
  "foundation_planned",
  "foundation",
  "runtime",
] as const;

export type ErpRuntimeModuleLifecycle =
  (typeof ERP_RUNTIME_MODULE_LIFECYCLES)[number];

/** @deprecated Use extended status set — `foundation` lifecycle alias retained for compat */
export const ERP_RUNTIME_MODULE_STATUSES = [
  "wire_only",
  "blocked",
  "foundation_authorized",
  "foundation_verified",
  "runtime_authorized",
  "runtime_verified",
  "deprecated",
] as const;

export type ErpRuntimeModuleStatus =
  (typeof ERP_RUNTIME_MODULE_STATUSES)[number];

export const PERMISSION_PARITY_MODES = [
  "exact",
  "subset_allowed",
  "deferred",
] as const;

export type PermissionParityMode = (typeof PERMISSION_PARITY_MODES)[number];

export const AUDIT_NAMESPACE_MODES = [
  "module_prefixed",
  "pas001b_wire",
] as const;

export type AuditNamespaceMode = (typeof AUDIT_NAMESPACE_MODES)[number];

export const METADATA_ROUTE_KINDS = [
  "erp_module_page",
  "internal_api",
  "server_action",
  "metadata_only",
] as const;

export type MetadataRouteKind = (typeof METADATA_ROUTE_KINDS)[number];

export const OUTBOX_REQUIREMENTS = [
  "required",
  "not_required",
  "deferred",
  "cross_domain_required",
] as const;

export type OutboxRequirement = (typeof OUTBOX_REQUIREMENTS)[number];

export const CONTEXT_REQUIREMENTS = [
  "required",
  "system_job_waived",
  "public_read_waived",
] as const;

export type ContextRequirement = (typeof CONTEXT_REQUIREMENTS)[number];

export const READINESS_DIMENSIONS = [
  "authority",
  "registry",
  "knowledge",
  "ownership",
  "database",
  "contextSpine",
  "permissions",
  "audit",
  "outbox",
  "metadata",
  "ui",
  "operations",
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
  /** camelCase permission key namespace segment — may differ from slug (e.g. supplyChain vs supply-chain). */
  readonly permissionNamespace: string;
  readonly permissionOwner: string;
  readonly routeSlug: string;
  readonly runtimePackage: string;
  readonly runtimeStatus: ErpRuntimeModuleStatus;
  readonly slug: string;
  readonly wirePackage: string;
}

export interface ErpRuntimeModuleRegistryDefinition {
  readonly modules: readonly ErpRuntimeModuleDefinition[];
}

export type ErpDomainModuleKvCatalog = Readonly<Record<string, string>>;

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
  readonly permissionNamespace: string;
  readonly permissionParity: PermissionParityMode;
  readonly registryPermissionKeys?: readonly string[];
}

export interface ModuleAuditMapDefinition {
  readonly actions: readonly string[];
  readonly auditNamespaceMode: AuditNamespaceMode;
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
  readonly routeKind: MetadataRouteKind;
  readonly surfaceId: string;
  readonly uiBlockReference?: string;
}

export interface ModuleMetadataBindingDefinition {
  readonly kvId: string;
  readonly module: string;
  readonly surfaces: readonly ModuleMetadataSurfaceBinding[];
}

export interface ModuleContextSpineConsumerDefinition {
  readonly forbiddenIngress: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly requiredResolvers: readonly string[];
}

export interface ModuleDatabaseTableBoundary {
  readonly auditFields: readonly string[];
  readonly canonicalIdField: string;
  readonly companyScoped: boolean;
  readonly effectiveDatingField?: string;
  readonly internalPkField: string;
  readonly lifecycleField?: string;
  readonly migrationPath: string;
  readonly ownershipRegistryRow: string;
  readonly rlsExpectation: string;
  readonly tableName: string;
  readonly tenantScoped: boolean;
}

export interface ModuleDatabaseBoundaryDefinition {
  readonly kvId: string;
  readonly module: string;
  readonly tables: readonly ModuleDatabaseTableBoundary[];
}

export interface ModuleOperationDefinition {
  readonly auditAction: string;
  readonly contextRequirement: ContextRequirement;
  readonly contextWaiverReason?: string;
  readonly crossDomainDependencies?: readonly string[];
  readonly databaseTablesTouched?: readonly string[];
  readonly metadataSurfaceId?: string;
  readonly operationId: string;
  readonly outboxDecision: OutboxRequirement;
  readonly outboxEvent?: string;
  readonly permissionKey: string;
  readonly testEvidence?: string;
  readonly uiWaiver?: boolean;
  readonly workflowRequirement?: string;
}

export interface ModuleOperationCatalogDefinition {
  readonly kvId: string;
  readonly module: string;
  readonly operations: readonly ModuleOperationDefinition[];
}

export interface ModuleRuntimeContractDefinition {
  readonly crossDomainDependencies: readonly string[];
  readonly documentFamilies: readonly string[];
  readonly kvId: string;
  readonly lifecycle: ErpRuntimeModuleLifecycle;
  readonly module: string;
  readonly nonGoals: readonly string[];
  readonly operationSummary: readonly string[];
  readonly requiredGates: readonly string[];
}

export interface ModulePolicyRule {
  readonly action: string;
  readonly blockedReason?: string;
  readonly crossDomainAdrRequired?: string;
  readonly permissionKey: string;
}

export interface ModulePolicyDefinition {
  readonly approveRules: readonly ModulePolicyRule[];
  readonly blockedOperations: readonly string[];
  readonly createRules: readonly ModulePolicyRule[];
  readonly kvId: string;
  readonly module: string;
  readonly postRules: readonly ModulePolicyRule[];
}

export type ModuleReadinessVerdict =
  | "Pass"
  | "Foundation Pass"
  | "Fail"
  | "Deferred";

export interface ModuleReadinessReportRow {
  readonly dimension: ReadinessDimension;
  readonly evidence: string;
  readonly gate: string;
  readonly missing: string;
  readonly verdict: ModuleReadinessVerdict;
}

export interface AssertModuleReadinessOptions {
  readonly evidencePathValidator?: (relativePath: string) => boolean;
  readonly validateEvidencePaths?: boolean;
}

export interface ErpRuntimeModuleRegistryBundle {
  readonly blockedModuleSlugs?: readonly string[];
  readonly bundles: readonly ErpModuleFoundationBundle[];
  readonly erpDomainModuleKvIds: ErpDomainModuleKvCatalog;
  readonly registry: ErpRuntimeModuleRegistryDefinition;
  /** When true, every PAS-001B catalog slug must be registered or explicitly blocked. */
  readonly requireFullCatalogCoverage?: boolean;
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
  readonly contextSpineConsumer?: ModuleContextSpineConsumerDefinition;
  readonly databaseBoundary?: ModuleDatabaseBoundaryDefinition;
  readonly eventCatalog: ModuleEventCatalogDefinition;
  readonly evidence?: Partial<Readonly<Record<ReadinessDimension, string>>>;
  readonly knowledge: ModuleKnowledgeMapDefinition;
  readonly metadataBinding: ModuleMetadataBindingDefinition;
  readonly module: ErpRuntimeModuleDefinition;
  readonly operationCatalog?: ModuleOperationCatalogDefinition;
  readonly outboxContract: ModuleOutboxContractDefinition;
  readonly ownership: ModuleOwnershipDefinition;
  readonly permissionBinding: ModulePermissionBindingDefinition;
  readonly policy?: ModulePolicyDefinition;
  readonly readiness: ModuleReadinessDefinition;
  readonly runtimeContract?: ModuleRuntimeContractDefinition;
}

export interface ModuleReadinessAssertionResult {
  readonly checkedAt: string;
  readonly kvId: string;
  readonly module: string;
  readonly ok: true;
}

export interface ModuleRegistryAssertionResult {
  readonly checkedAt: string;
  readonly moduleCount: number;
  readonly ok: true;
}

export interface ModuleRuntimeCompletenessAssertionResult {
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

export class ModuleRegistryAssertionError extends Error {
  readonly failures: readonly string[];

  constructor(failures: readonly string[]) {
    super(
      `ERP runtime module registry failed (${failures.length}): ${failures.join("; ")}`
    );
    this.name = "ModuleRegistryAssertionError";
    this.failures = failures;
  }
}
