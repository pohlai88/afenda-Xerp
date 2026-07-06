import {
  normalizeCompanyIdForWire,
  normalizeOrganizationIdForWire,
  normalizeProjectIdForWire,
  normalizeTenantIdForWire,
  parseOptionalCompanyId,
  parseOptionalOrganizationId,
  parseProjectId,
  parseTenantId,
} from "../identity/families/tenant-hierarchy-id.contract.js";
import { assertWireProjectContext } from "./project-context.assert.js";
import type {
  ProjectContext,
  ProjectWireContext,
} from "./project-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseValidatedProjectContext(
  value: ProjectWireContext
): ProjectContext {
  return {
    projectId: parseProjectId(value.projectId),
    tenantId: parseTenantId(value.tenantId),
    companyId: parseOptionalCompanyId(value.companyId),
    organizationUnitId: parseOptionalOrganizationId(value.organizationUnitId),
    slug: value.slug,
    displayName: value.displayName,
    status: value.status,
  };
}

export function parseProjectContext(value: ProjectWireContext): ProjectContext {
  assertWireProjectContext(value);
  return parseValidatedProjectContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownProjectContext(value: unknown): ProjectContext {
  assertWireProjectContext(value);
  return parseValidatedProjectContext(value);
}

export function normalizeProjectContextForWire(
  value: ProjectContext
): ProjectWireContext {
  return {
    projectId: requiredWireString(
      normalizeProjectIdForWire(value.projectId),
      "projectId"
    ),
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    companyId: normalizeCompanyIdForWire(value.companyId),
    organizationUnitId: normalizeOrganizationIdForWire(
      value.organizationUnitId
    ),
    slug: value.slug,
    displayName: value.displayName,
    status: value.status,
  };
}

/** Wire egress alias — same contract as `normalizeProjectContextForWire`. */
export function serializeProjectContext(
  value: ProjectContext
): ProjectWireContext {
  return normalizeProjectContextForWire(value);
}
