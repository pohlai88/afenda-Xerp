/**
 * Tenant hierarchy enterprise IDs (PAS-001 category: tenant-hierarchy).
 */

import {
  normalizeBrandedIdForWire,
  normalizeOptionalBrandedIdForWire,
} from "../wire/identity-wire.contract.js";
import {
  defineEnterpriseFamily,
  type EnterpriseBrand,
} from "./define-enterprise-family.js";

const tenant = defineEnterpriseFamily("tenant");
const entityGroup = defineEnterpriseFamily("entityGroup");
const company = defineEnterpriseFamily("company");
const organization = defineEnterpriseFamily("organization");
const team = defineEnterpriseFamily("team");
const project = defineEnterpriseFamily("project");

export type TenantId = EnterpriseBrand<"tenant">;
export type EntityGroupId = EnterpriseBrand<"entityGroup">;
export type CompanyId = EnterpriseBrand<"company">;
export type OrganizationId = EnterpriseBrand<"organization">;
export type TeamId = EnterpriseBrand<"team">;
export type ProjectId = EnterpriseBrand<"project">;

export const parseTenantId = tenant.parse;
export const parseOptionalTenantId = tenant.parseOptional;
export const createTenantId = tenant.create;
export const toTenantId = tenant.to;

export const parseEntityGroupId = entityGroup.parse;
export const parseOptionalEntityGroupId = entityGroup.parseOptional;
export const createEntityGroupId = entityGroup.create;
export const toEntityGroupId = entityGroup.to;

export const parseCompanyId = company.parse;
export const parseOptionalCompanyId = company.parseOptional;
export const createCompanyId = company.create;
export const toCompanyId = company.to;

export const parseOrganizationId = organization.parse;
export const parseOptionalOrganizationId = organization.parseOptional;
export const createOrganizationId = organization.create;
export const toOrganizationId = organization.to;

export const parseTeamId = team.parse;
export const parseOptionalTeamId = team.parseOptional;
export const createTeamId = team.create;
export const toTeamId = team.to;

export const parseProjectId = project.parse;
export const parseOptionalProjectId = project.parseOptional;
export const createProjectId = project.create;
export const toProjectId = project.to;

export function normalizeTenantIdForWire(value: string | TenantId): string {
  return normalizeBrandedIdForWire(value, toTenantId);
}

export function normalizeEntityGroupIdForWire(
  value: string | EntityGroupId
): string {
  return normalizeBrandedIdForWire(value, toEntityGroupId);
}

export function normalizeCompanyIdForWire(
  value: string | CompanyId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toCompanyId);
}

export function normalizeOrganizationIdForWire(
  value: string | OrganizationId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toOrganizationId);
}

export function normalizeTeamIdForWire(
  value: string | TeamId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toTeamId);
}

export function normalizeProjectIdForWire(
  value: string | ProjectId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toProjectId);
}
