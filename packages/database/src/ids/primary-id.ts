import { uuid } from "drizzle-orm/pg-core";

import { UUID_V7_DEFAULT } from "./uuid-v7-default.js";

function buildPrimaryId(columnName = "id") {
  return uuid(columnName).primaryKey().default(UUID_V7_DEFAULT);
}

export type PrimaryIdColumn = ReturnType<typeof buildPrimaryId>;

/**
 * Canonical Afenda platform primary key (`id uuid default uuid_generate_v7()`).
 *
 * ADR-0022: internal relational identity only — never use `enterprise_id text` as PK.
 * Pair with `enterpriseIdColumn()` for canonical Kernel IDs at API/wire boundaries.
 */
export function primaryId(columnName = "id"): PrimaryIdColumn {
  return buildPrimaryId(columnName);
}

export const tenantId = (): PrimaryIdColumn => primaryId("tenant_id");
export const companyId = (): PrimaryIdColumn => primaryId("company_id");
export const organizationId = (): PrimaryIdColumn =>
  primaryId("organization_id");
export const userId = (): PrimaryIdColumn => primaryId("user_id");
export const roleId = (): PrimaryIdColumn => primaryId("role_id");
export const membershipId = (): PrimaryIdColumn => primaryId("membership_id");
export const permissionId = (): PrimaryIdColumn => primaryId("permission_id");
export const policyId = (): PrimaryIdColumn => primaryId("policy_id");
export const entityGroupId = (): PrimaryIdColumn =>
  primaryId("entity_group_id");
export const projectId = (): PrimaryIdColumn => primaryId("project_id");
export const teamId = (): PrimaryIdColumn => primaryId("team_id");
export const productId = (): PrimaryIdColumn => primaryId("product_id");
export const warehouseId = (): PrimaryIdColumn => primaryId("warehouse_id");
export const ownershipInterestId = (): PrimaryIdColumn =>
  primaryId("ownership_interest_id");
export const auditEventId = (): PrimaryIdColumn => primaryId("audit_event_id");
