import type {
  ErpModuleFoundationBundle,
  ModuleOperationDefinition,
} from "../erp-module-foundation.types.js";

interface OperationCompletenessContext {
  readonly auditActions: ReadonlySet<string>;
  readonly catalogEvents: ReadonlySet<string>;
  readonly databaseTables: ReadonlySet<string>;
  readonly hasContextSpineConsumer: boolean;
  readonly hasDatabaseBoundary: boolean;
  readonly metadataSurfaceIds: ReadonlySet<string>;
  readonly outboxByEvent: ReadonlyMap<string, string>;
  readonly permissionKeys: ReadonlySet<string>;
}

function buildOperationCompletenessContext(
  bundle: ErpModuleFoundationBundle
): OperationCompletenessContext {
  return {
    permissionKeys: new Set(bundle.permissionBinding.kernelPermissionKeys),
    auditActions: new Set(bundle.auditMap.actions),
    catalogEvents: new Set(bundle.eventCatalog.events),
    outboxByEvent: new Map(
      bundle.outboxContract.entries.map((entry) => [
        entry.event,
        entry.requirement,
      ])
    ),
    metadataSurfaceIds: new Set(
      bundle.metadataBinding.surfaces.map((surface) => surface.surfaceId)
    ),
    databaseTables: new Set(
      bundle.databaseBoundary?.tables.map((table) => table.tableName) ?? []
    ),
    hasContextSpineConsumer: bundle.contextSpineConsumer !== undefined,
    hasDatabaseBoundary: bundle.databaseBoundary !== undefined,
  };
}

function collectPermissionFailures(
  label: string,
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  if (context.permissionKeys.has(operation.permissionKey)) {
    return [];
  }

  return [
    `operation "${label}": permission "${operation.permissionKey}" missing from permission binding`,
  ];
}

function collectAuditFailures(
  label: string,
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  if (context.auditActions.has(operation.auditAction)) {
    return [];
  }

  return [
    `operation "${label}": audit action "${operation.auditAction}" missing from audit map`,
  ];
}

function collectContextFailures(
  label: string,
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  const failures: string[] = [];

  if (
    operation.contextRequirement === "required" &&
    !context.hasContextSpineConsumer
  ) {
    failures.push(
      `operation "${label}": contextRequirement required but contextSpineConsumer is missing`
    );
  }

  if (
    operation.contextRequirement !== "required" &&
    (!operation.contextWaiverReason ||
      operation.contextWaiverReason.trim().length === 0)
  ) {
    failures.push(
      `operation "${label}": contextWaiverReason is required when contextRequirement is waived`
    );
  }

  return failures;
}

function collectMetadataFailures(
  label: string,
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  if (operation.metadataSurfaceId) {
    if (context.metadataSurfaceIds.has(operation.metadataSurfaceId)) {
      return [];
    }

    return [
      `operation "${label}": metadata surface "${operation.metadataSurfaceId}" missing from metadata binding`,
    ];
  }

  if (operation.uiWaiver) {
    return [];
  }

  return [`operation "${label}": requires metadataSurfaceId or uiWaiver=true`];
}

function collectDatabaseFailures(
  label: string,
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  if (!(operation.databaseTablesTouched && context.hasDatabaseBoundary)) {
    return [];
  }

  const failures: string[] = [];
  for (const table of operation.databaseTablesTouched) {
    if (!context.databaseTables.has(table)) {
      failures.push(
        `operation "${label}": database table "${table}" missing from database boundary`
      );
    }
  }

  return failures;
}

function collectOutboxFailures(
  label: string,
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  if (operation.outboxDecision !== "required") {
    return [];
  }

  const outboxEvent = operation.outboxEvent;
  if (!outboxEvent) {
    return [
      `operation "${label}": outboxDecision required but outboxEvent is missing`,
    ];
  }

  if (!context.catalogEvents.has(outboxEvent)) {
    return [
      `operation "${label}": outbox event "${outboxEvent}" missing from event catalog`,
    ];
  }

  if (!context.outboxByEvent.has(outboxEvent)) {
    return [
      `operation "${label}": outbox event "${outboxEvent}" missing from outbox contract`,
    ];
  }

  if (context.outboxByEvent.get(outboxEvent) !== "required") {
    return [
      `operation "${label}": outbox event "${outboxEvent}" must be required in outbox contract when operation outboxDecision is required`,
    ];
  }

  return [];
}

function collectTestEvidenceFailures(
  label: string,
  operation: ModuleOperationDefinition
): readonly string[] {
  if (operation.testEvidence && operation.testEvidence.trim().length > 0) {
    return [];
  }

  return [`operation "${label}": testEvidence path is missing`];
}

function collectOperationCompletenessFailures(
  operation: ModuleOperationDefinition,
  context: OperationCompletenessContext
): readonly string[] {
  const label = operation.operationId;

  return [
    ...collectPermissionFailures(label, operation, context),
    ...collectAuditFailures(label, operation, context),
    ...collectContextFailures(label, operation, context),
    ...collectMetadataFailures(label, operation, context),
    ...collectDatabaseFailures(label, operation, context),
    ...collectOutboxFailures(label, operation, context),
    ...collectTestEvidenceFailures(label, operation),
  ];
}

export function collectAllOperationCompletenessFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  if (!bundle.operationCatalog) {
    return [];
  }

  const context = buildOperationCompletenessContext(bundle);
  const failures: string[] = [];

  for (const operation of bundle.operationCatalog.operations) {
    failures.push(...collectOperationCompletenessFailures(operation, context));
  }

  return failures;
}
