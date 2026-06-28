import {
  normalizeCompanyIdForWire,
  normalizeOrganizationIdForWire,
  normalizeTenantIdForWire,
  parseOptionalCompanyId,
  parseOptionalOrganizationId,
  parseOrganizationId,
  parseTeamId,
  parseTenantId,
  toOrganizationId,
  toTeamId,
} from "../identity/index.js";
import { assertWireTeamContext } from "./team-context.assert.js";
import type {
  TeamAuthorityId,
  TeamContext,
  TeamWireContext,
} from "./team-context.contract.js";

function requiredWireString(value: string | null, label: string): string {
  if (value === null) {
    throw new Error(
      `${label} wire normalization produced null from required branded value.`
    );
  }

  return value;
}

/** Org-backed team selection wires `org_*` into `teamId` until TIP-030 teams resolver. */
function parseTeamAuthorityId(value: string): TeamAuthorityId {
  try {
    return parseTeamId(value);
  } catch {
    return parseOrganizationId(value);
  }
}

function normalizeTeamAuthorityIdForWire(value: TeamAuthorityId): string {
  const raw = `${value}`;

  if (raw.startsWith("org_")) {
    return toOrganizationId(parseOrganizationId(raw));
  }

  return toTeamId(parseTeamId(raw));
}

function parseValidatedTeamContext(value: TeamWireContext): TeamContext {
  return {
    teamId: parseTeamAuthorityId(value.teamId),
    tenantId: parseTenantId(value.tenantId),
    companyId: parseOptionalCompanyId(value.companyId),
    organizationUnitId: parseOptionalOrganizationId(value.organizationUnitId),
    slug: value.slug,
    displayName: value.displayName,
    status: value.status,
  };
}

export function parseTeamContext(value: TeamWireContext): TeamContext {
  assertWireTeamContext(value);
  return parseValidatedTeamContext(value);
}

/** JSON/API ingress — assert unknown wire, then brand IDs. */
export function parseUnknownTeamContext(value: unknown): TeamContext {
  assertWireTeamContext(value);
  return parseValidatedTeamContext(value);
}

export function normalizeTeamContextForWire(
  value: TeamContext
): TeamWireContext {
  const teamIdWire = normalizeTeamAuthorityIdForWire(value.teamId);

  return {
    teamId: requiredWireString(teamIdWire, "teamId"),
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
