import { uuid } from "drizzle-orm/pg-core";

function buildEntityRefId(columnName: string) {
  return uuid(columnName);
}

export type EntityRefColumn = ReturnType<typeof buildEntityRefId>;

/** Canonical UUID foreign-key column — references parent `id uuid`, never `enterprise_id`. */
export function idRef(columnName: string): EntityRefColumn {
  return buildEntityRefId(columnName);
}

/** @deprecated Use idRef — ADR-0022 split-ID model: FKs target uuid PK only. */
export const entityRefId = idRef;

export const tenantIdRef = (): EntityRefColumn => idRef("tenant_id");
export const companyIdRef = (): EntityRefColumn => idRef("company_id");
export const organizationIdRef = (): EntityRefColumn =>
  idRef("organization_id");
export const userIdRef = (): EntityRefColumn => idRef("user_id");
export const roleIdRef = (): EntityRefColumn => idRef("role_id");
export const permissionIdRef = (): EntityRefColumn => idRef("permission_id");
export const parentOrganizationIdRef = (): EntityRefColumn =>
  idRef("parent_organization_id");
export const entityGroupIdRef = (): EntityRefColumn => idRef("entity_group_id");
export const projectIdRef = (): EntityRefColumn => idRef("project_id");
export const teamIdRef = (): EntityRefColumn => idRef("team_id");
export const productIdRef = (): EntityRefColumn => idRef("product_id");
export const warehouseIdRef = (): EntityRefColumn => idRef("warehouse_id");
export const parentLegalEntityIdRef = (): EntityRefColumn =>
  idRef("parent_legal_entity_id");
export const childLegalEntityIdRef = (): EntityRefColumn =>
  idRef("child_legal_entity_id");
export const fiscalCalendarIdRef = (): EntityRefColumn =>
  idRef("fiscal_calendar_id");
export const actorUserIdRef = (): EntityRefColumn => idRef("actor_user_id");
