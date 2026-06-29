import type {
  ContextRequirement,
  ModuleOperationCatalogDefinition,
  ModuleOperationDefinition,
  OutboxRequirement,
} from "./erp-module-foundation.types.js";
import {
  CONTEXT_REQUIREMENTS,
  OUTBOX_REQUIREMENTS,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertPermissionKeyFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleOperationCatalogInput {
  readonly kvId: string;
  readonly module: string;
  readonly operations: readonly ModuleOperationDefinition[];
}

function assertOutboxRequirement(value: OutboxRequirement): void {
  if (!OUTBOX_REQUIREMENTS.includes(value)) {
    throw new Error(`invalid outbox requirement: "${value}"`);
  }
}

function assertContextRequirement(value: ContextRequirement): void {
  if (!CONTEXT_REQUIREMENTS.includes(value)) {
    throw new Error(`invalid contextRequirement: "${value}"`);
  }
}

function validateOperationDefinition(
  module: string,
  operation: ModuleOperationDefinition
): ModuleOperationDefinition {
  assertNonEmptyString(operation.operationId, "operationId");
  assertNonEmptyString(operation.auditAction, "auditAction");
  assertPermissionKeyFormat(operation.permissionKey);
  assertOutboxRequirement(operation.outboxDecision);
  assertContextRequirement(operation.contextRequirement);

  if (
    operation.contextRequirement !== "required" &&
    (!operation.contextWaiverReason ||
      operation.contextWaiverReason.trim().length === 0)
  ) {
    throw new Error(
      `operation "${operation.operationId}": contextWaiverReason is required when contextRequirement is waived`
    );
  }

  if (
    operation.outboxDecision === "required" &&
    (!operation.outboxEvent || operation.outboxEvent.trim().length === 0)
  ) {
    throw new Error(
      `operation "${operation.operationId}": outboxDecision required but outboxEvent is missing`
    );
  }

  if (!operation.operationId.startsWith(`${module}.`)) {
    throw new Error(
      `operationId must be prefixed with "${module}." — got "${operation.operationId}"`
    );
  }

  return operation;
}

function normalizeOperationDefinition(
  operation: ModuleOperationDefinition
): ModuleOperationDefinition {
  return {
    operationId: operation.operationId,
    permissionKey: operation.permissionKey,
    auditAction: operation.auditAction,
    outboxDecision: operation.outboxDecision,
    contextRequirement: operation.contextRequirement,
    ...(operation.outboxEvent ? { outboxEvent: operation.outboxEvent } : {}),
    ...(operation.contextWaiverReason
      ? { contextWaiverReason: operation.contextWaiverReason }
      : {}),
    ...(operation.metadataSurfaceId
      ? { metadataSurfaceId: operation.metadataSurfaceId }
      : {}),
    ...(operation.databaseTablesTouched
      ? { databaseTablesTouched: operation.databaseTablesTouched }
      : {}),
    ...(operation.workflowRequirement
      ? { workflowRequirement: operation.workflowRequirement }
      : {}),
    ...(operation.crossDomainDependencies
      ? { crossDomainDependencies: operation.crossDomainDependencies }
      : {}),
    ...(operation.testEvidence ? { testEvidence: operation.testEvidence } : {}),
    ...(operation.uiWaiver === undefined
      ? {}
      : { uiWaiver: operation.uiWaiver }),
  } as const;
}

export function defineModuleOperationCatalog(
  input: DefineModuleOperationCatalogInput
): ModuleOperationCatalogDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.operations.length === 0) {
    throw new Error(
      "defineModuleOperationCatalog: operations must not be empty"
    );
  }

  assertUniqueStrings(
    input.operations.map((operation) => operation.operationId),
    "operationId"
  );

  const operations = input.operations.map((operation) =>
    normalizeOperationDefinition(
      validateOperationDefinition(input.module, operation)
    )
  );

  return {
    module: input.module,
    kvId: input.kvId,
    operations,
  } as const;
}
