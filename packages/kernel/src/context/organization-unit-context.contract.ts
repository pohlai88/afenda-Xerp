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

/** Operational subdivision inside a legal entity. */
export interface OrganizationUnitContext {
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
