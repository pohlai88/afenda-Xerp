import {
  normalizeCompanyIdForWire,
  normalizeOrganizationIdForWire,
  normalizeTenantIdForWire,
  parseCompanyId,
  parseOptionalOrganizationId,
  parseOrganizationId,
  parseTenantId,
} from "../identity/index.js";
import { assertWireOrganizationUnitContext } from "./organization-unit-context.assert.js";
import type {
  OrganizationUnitContext,
  OrganizationUnitWireContext,
} from "./organization-unit-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

function parseValidatedOrganizationUnitContext(
  value: OrganizationUnitWireContext
): OrganizationUnitContext {
  return {
    organizationUnitId: parseOrganizationId(value.organizationUnitId),
    tenantId: parseTenantId(value.tenantId),
    companyId: parseCompanyId(value.companyId),
    slug: value.slug,
    displayName: value.displayName,
    organizationUnitType: value.organizationUnitType,
    parentOrganizationUnitId: parseOptionalOrganizationId(
      value.parentOrganizationUnitId
    ),
    status: value.status,
    effectiveFrom: value.effectiveFrom,
    effectiveTo: value.effectiveTo,
  };
}

export function parseOrganizationUnitContext(
  value: OrganizationUnitWireContext
): OrganizationUnitContext {
  assertWireOrganizationUnitContext(value);
  return parseValidatedOrganizationUnitContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownOrganizationUnitContext(
  value: unknown
): OrganizationUnitContext {
  assertWireOrganizationUnitContext(value);
  return parseValidatedOrganizationUnitContext(value);
}

export function normalizeOrganizationUnitContextForWire(
  value: OrganizationUnitContext
): OrganizationUnitWireContext {
  return {
    organizationUnitId: requiredWireString(
      normalizeOrganizationIdForWire(value.organizationUnitId),
      "organizationUnitId"
    ),
    tenantId: requiredWireString(
      normalizeTenantIdForWire(value.tenantId),
      "tenantId"
    ),
    companyId: requiredWireString(
      normalizeCompanyIdForWire(value.companyId),
      "companyId"
    ),
    slug: value.slug,
    displayName: value.displayName,
    organizationUnitType: value.organizationUnitType,
    parentOrganizationUnitId: normalizeOrganizationIdForWire(
      value.parentOrganizationUnitId
    ),
    status: value.status,
    effectiveFrom: value.effectiveFrom,
    effectiveTo: value.effectiveTo,
  };
}
