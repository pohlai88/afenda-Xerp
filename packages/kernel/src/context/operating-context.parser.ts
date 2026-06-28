import {
  normalizeOrganizationIdForWire,
  normalizeProjectIdForWire,
  normalizeTenantIdForWire,
  parseCompanyId,
  parseOrganizationId,
  parseProjectId,
  parseTenantId,
} from "../identity/index.js";
import {
  normalizeConsolidationScopeContextForWire,
  parseConsolidationScopeContext,
} from "./consolidation-scope-context.parser.js";
import {
  normalizeEntityGroupContextForWire,
  parseEntityGroupContext,
} from "./entity-group-context.parser.js";
import {
  normalizeLegalEntityContextForWire,
  parseLegalEntityContext,
} from "./legal-entity-context.parser.js";
import { assertWireOperatingContext } from "./operating-context.assert.js";
import type {
  OperatingContext,
  OperatingContextWireContext,
  SurfaceWireContext,
  WorkflowWireContext,
  WorkspaceWireContext,
} from "./operating-context.contract.js";
import {
  normalizeOrganizationUnitContextForWire,
  parseOrganizationUnitContext,
} from "./organization-unit-context.parser.js";
import {
  normalizeOwnershipInterestContextForWire,
  parseOwnershipInterestContext,
} from "./ownership-interest-context.parser.js";
import {
  brandPermissionScopeContextFromWire,
  normalizePermissionScopeContextForWire,
} from "./permission-scope-context.projection.js";
import {
  normalizeProjectContextForWire,
  parseProjectContext,
} from "./project-context.parser.js";
import type { SurfaceContext } from "./surface-context.contract.js";
import {
  normalizeTeamContextForWire,
  parseTeamContext,
} from "./team-context.parser.js";
import {
  normalizeTenantContextForWire,
  parseTenantContext,
} from "./tenant-context.parser.js";
import type { WorkflowContext } from "./workflow-context.contract.js";
import type { WorkspaceContext } from "./workspace-context.contract.js";

function parseWorkspaceWireContext(
  value: WorkspaceWireContext
): WorkspaceContext {
  return {
    tenantId: `${parseTenantId(value.tenantId)}`,
    companyId: `${parseCompanyId(value.companyId)}`,
    organizationId:
      value.organizationId === null
        ? null
        : `${parseOrganizationId(value.organizationId)}`,
    projectId:
      value.projectId === null ? null : `${parseProjectId(value.projectId)}`,
  };
}

function parseSurfaceWireContext(value: SurfaceWireContext): SurfaceContext {
  return {
    surfaceId: value.surfaceId.trim(),
  };
}

function parseWorkflowWireContext(value: WorkflowWireContext): WorkflowContext {
  return {
    workflowId: value.workflowId.trim(),
    surfaceId: value.surfaceId === null ? null : value.surfaceId.trim(),
  };
}

function normalizeWorkspaceWireContext(
  value: WorkspaceContext
): WorkspaceWireContext {
  return {
    tenantId: `${normalizeTenantIdForWire(parseTenantId(value.tenantId))}`,
    companyId: `${parseCompanyId(value.companyId)}`,
    organizationId: normalizeOrganizationIdForWire(value.organizationId),
    projectId: normalizeProjectIdForWire(value.projectId),
  };
}

function normalizeSurfaceWireContext(
  value: SurfaceContext
): SurfaceWireContext {
  return {
    surfaceId: value.surfaceId.trim(),
  };
}

function normalizeWorkflowWireContext(
  value: WorkflowContext
): WorkflowWireContext {
  return {
    workflowId: value.workflowId.trim(),
    surfaceId: value.surfaceId === null ? null : value.surfaceId.trim(),
  };
}

function parseValidatedOperatingContext(
  value: OperatingContextWireContext
): OperatingContext {
  return {
    actor: value.actor,
    correlationId: value.correlationId,
    tenant: parseTenantContext(value.tenant),
    entityGroup:
      value.entityGroup === null
        ? null
        : parseEntityGroupContext(value.entityGroup),
    legalEntity: parseLegalEntityContext(value.legalEntity),
    ownershipInterests: value.ownershipInterests.map((interest) =>
      parseOwnershipInterestContext(interest)
    ),
    organizationUnit:
      value.organizationUnit === null
        ? null
        : parseOrganizationUnitContext(value.organizationUnit),
    team: value.team === null ? null : parseTeamContext(value.team),
    project: value.project === null ? null : parseProjectContext(value.project),
    workspace: parseWorkspaceWireContext(value.workspace),
    permissionScope: brandPermissionScopeContextFromWire(value.permissionScope),
    consolidationScope:
      value.consolidationScope === null
        ? null
        : parseConsolidationScopeContext(value.consolidationScope),
    surface:
      value.surface === null ? null : parseSurfaceWireContext(value.surface),
    workflow:
      value.workflow === null ? null : parseWorkflowWireContext(value.workflow),
  };
}

export function parseOperatingContext(
  value: OperatingContextWireContext
): OperatingContext {
  assertWireOperatingContext(value);
  return parseValidatedOperatingContext(value);
}

/** JSON/API ingress — assert unknown composed wire, then brand nested layers. */
export function parseUnknownOperatingContext(value: unknown): OperatingContext {
  assertWireOperatingContext(value);
  return parseValidatedOperatingContext(value);
}

export function normalizeOperatingContextForWire(
  value: OperatingContext
): OperatingContextWireContext {
  return {
    actor: value.actor,
    correlationId: value.correlationId,
    tenant: normalizeTenantContextForWire(value.tenant),
    entityGroup:
      value.entityGroup === null
        ? null
        : normalizeEntityGroupContextForWire(value.entityGroup),
    legalEntity: normalizeLegalEntityContextForWire(value.legalEntity),
    ownershipInterests: value.ownershipInterests.map((interest) =>
      normalizeOwnershipInterestContextForWire(interest)
    ),
    organizationUnit:
      value.organizationUnit === null
        ? null
        : normalizeOrganizationUnitContextForWire(value.organizationUnit),
    team: value.team === null ? null : normalizeTeamContextForWire(value.team),
    project:
      value.project === null
        ? null
        : normalizeProjectContextForWire(value.project),
    workspace: normalizeWorkspaceWireContext(value.workspace),
    permissionScope: normalizePermissionScopeContextForWire(
      value.permissionScope
    ),
    consolidationScope:
      value.consolidationScope === null
        ? null
        : normalizeConsolidationScopeContextForWire(value.consolidationScope),
    surface:
      value.surface === null
        ? null
        : normalizeSurfaceWireContext(value.surface),
    workflow:
      value.workflow === null
        ? null
        : normalizeWorkflowWireContext(value.workflow),
  };
}

/** Wire egress alias — same contract as `normalizeOperatingContextForWire`. */
export function serializeOperatingContext(
  value: OperatingContext
): OperatingContextWireContext {
  return normalizeOperatingContextForWire(value);
}
