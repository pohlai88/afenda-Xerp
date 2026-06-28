import { assertWireConsolidationScopeContext } from "./consolidation-scope-context.assert.js";
import { assertWireEntityGroupContext } from "./entity-group-context.assert.js";
import {
  assertLegalEntitySlug,
  assertWireLegalEntityContext,
} from "./legal-entity-context.assert.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
import type {
  OperatingContextActor,
  OperatingContextWireContext,
  SurfaceWireContext,
  TenantWireContext,
  WorkflowWireContext,
  WorkspaceWireContext,
} from "./operating-context.contract.js";
import { assertWireOrganizationUnitContext } from "./organization-unit-context.assert.js";
import { assertWireOwnershipInterestContext } from "./ownership-interest-context.assert.js";
import { assertWirePermissionScopeContext } from "./permission-scope-context.assert.js";
import { assertWireProjectContext } from "./project-context.assert.js";
import { assertWireTeamContext } from "./team-context.assert.js";

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _OperatingContextWireSerializable =
  AssertJsonSerializable<OperatingContextWireContext>;

/** Compile-time guard — composed operating context wire must remain JSON-serializable. */
export type assertOperatingContextWireSerializable =
  _OperatingContextWireSerializable extends true ? true : never;

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertOperatingContextText(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertOperatingContextOptionalText(
  value: string | null,
  label: string
): void {
  if (value !== null && !value.trim()) {
    throw new Error(`${label} must be null or a non-empty string.`);
  }
}

function assertOperatingContextActor(value: OperatingContextActor): void {
  assertOperatingContextText(value.userId, "actor.userId");
}

function assertTenantWireContext(value: TenantWireContext): void {
  assertOperatingContextText(value.tenantId, "tenant.tenantId");
  assertLegalEntitySlug(value.slug);
  assertOperatingContextText(value.displayName, "tenant.displayName");

  if (!isPlatformLifecycleStatus(value.status)) {
    throw new Error(
      `tenant.status must be one of: ${PLATFORM_LIFECYCLE_STATUSES.join(", ")}.`
    );
  }
}

function assertWorkspaceWireContext(value: WorkspaceWireContext): void {
  assertOperatingContextText(value.tenantId, "workspace.tenantId");
  assertOperatingContextText(value.companyId, "workspace.companyId");
  assertOperatingContextOptionalText(
    value.organizationId,
    "workspace.organizationId"
  );
  assertOperatingContextOptionalText(value.projectId, "workspace.projectId");
}

function assertSurfaceWireContext(value: SurfaceWireContext): void {
  assertOperatingContextText(value.surfaceId, "surface.surfaceId");
}

function assertWorkflowWireContext(value: WorkflowWireContext): void {
  assertOperatingContextText(value.workflowId, "workflow.workflowId");
  assertOperatingContextOptionalText(value.surfaceId, "workflow.surfaceId");
}

function assertOperatingContextWireContext(
  value: OperatingContextWireContext
): void {
  assertOperatingContextActor(value.actor);
  assertOperatingContextText(value.correlationId, "correlationId");
  assertTenantWireContext(value.tenant);
  assertWireLegalEntityContext(value.legalEntity);
  assertWirePermissionScopeContext(value.permissionScope);
  assertWorkspaceWireContext(value.workspace);

  if (value.entityGroup !== null) {
    assertWireEntityGroupContext(value.entityGroup);
  }

  if (value.organizationUnit !== null) {
    assertWireOrganizationUnitContext(value.organizationUnit);
  }

  if (value.team !== null) {
    assertWireTeamContext(value.team);
  }

  if (value.project !== null) {
    assertWireProjectContext(value.project);
  }

  if (value.consolidationScope !== null) {
    assertWireConsolidationScopeContext(value.consolidationScope);
  }

  if (value.surface !== null) {
    assertSurfaceWireContext(value.surface);
  }

  if (value.workflow !== null) {
    assertWorkflowWireContext(value.workflow);
  }

  if (!Array.isArray(value.ownershipInterests)) {
    throw new Error("ownershipInterests must be an array.");
  }

  for (const [index, interest] of value.ownershipInterests.entries()) {
    try {
      assertWireOwnershipInterestContext(interest);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid ownership interest.";
      throw new Error(`ownershipInterests[${index}]: ${message}`);
    }
  }
}

/**
 * JSON ingress guard — narrow unknown composed wire, then run semantic asserts.
 * Fail closed before child parse* branding.
 */
export function assertWireOperatingContext(
  value: unknown
): asserts value is OperatingContextWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("OperatingContextWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["correlationId"] !== "string") {
    throw new Error("correlationId must be a string.");
  }
  if (record["actor"] === null || typeof record["actor"] !== "object") {
    throw new Error("actor must be an object.");
  }
  if (record["tenant"] === null || typeof record["tenant"] !== "object") {
    throw new Error("tenant must be an object.");
  }
  if (
    record["legalEntity"] === null ||
    typeof record["legalEntity"] !== "object"
  ) {
    throw new Error("legalEntity must be an object.");
  }
  if (
    record["permissionScope"] === null ||
    typeof record["permissionScope"] !== "object"
  ) {
    throw new Error("permissionScope must be an object.");
  }
  if (record["workspace"] === null || typeof record["workspace"] !== "object") {
    throw new Error("workspace must be an object.");
  }
  if (!Array.isArray(record["ownershipInterests"])) {
    throw new Error("ownershipInterests must be an array.");
  }

  assertOperatingContextWireContext(value as OperatingContextWireContext);
}
