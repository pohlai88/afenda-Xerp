import type { CompanyId, OrganizationId, TenantId } from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

export const ORGANIZATION_UNIT_TYPES = [
  "branch",
  "department",
  "site",
  "farm",
  "factory",
  "warehouse",
  "retail_outlet",
  "cost_center",
  "shared_service",
  "operating_unit",
  "company_root",
  "team",
] as const;

export type OrganizationUnitType = (typeof ORGANIZATION_UNIT_TYPES)[number];

/**
 * Operational subdivision inside a legal entity (PAS-001 §4.4).
 *
 * Kernel owns wire ingress triad and branded fields on `OperatingContext.organizationUnit`.
 * Persistence and resolver logic live in `@afenda/database` + `apps/erp`.
 */
export interface OrganizationUnitContext {
  readonly companyId: CompanyId;
  readonly displayName: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly organizationUnitId: OrganizationId;
  readonly organizationUnitType: OrganizationUnitType;
  readonly parentOrganizationUnitId: OrganizationId | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: TenantId;
}

/** JSON/wire format — plain string ids and JSON primitives. Parse via parser at ingress. */
export interface OrganizationUnitWireContext {
  readonly companyId: string;
  readonly displayName: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly organizationUnitId: string;
  readonly organizationUnitType: OrganizationUnitType;
  readonly parentOrganizationUnitId: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
