import { uuid } from "drizzle-orm/pg-core";

function buildPrimaryId(columnName = "id") {
  return uuid(columnName).primaryKey().defaultRandom();
}

function buildEntityRefId(columnName: string) {
  return uuid(columnName);
}

/** Locked Drizzle column type for all platform primary keys. */
export type PrimaryIdColumn = ReturnType<typeof buildPrimaryId>;

/** Locked Drizzle column type for platform foreign-key UUID columns. */
export type EntityRefColumn = ReturnType<typeof buildEntityRefId>;

/**
 * Canonical Afenda platform primary key.
 *
 * Ownership:
 * - UUID primary key generation
 * - entity identity for all platform tables
 *
 * Rules:
 * - UUID v4
 * - database-generated via `defaultRandom()`
 * - immutable primary key
 * - used by all platform entities in `@afenda/database`
 *
 * Prohibited outside this module:
 * - serial / bigint identity columns
 * - application-generated UUID defaults
 * - custom primary key patterns
 * - ad hoc `uuid().notNull()` primary keys
 */
export function primaryId(columnName = "id"): PrimaryIdColumn {
  return buildPrimaryId(columnName);
}

/**
 * Canonical UUID foreign-key column (non-PK).
 * Use entity-specific helpers for governed column names.
 */
export function entityRefId(columnName: string): EntityRefColumn {
  return buildEntityRefId(columnName);
}

/** Governed foreign-key column for tenant references. */
export const tenantIdRef = (): EntityRefColumn => entityRefId("tenant_id");

/** Governed foreign-key column for company references. */
export const companyIdRef = (): EntityRefColumn => entityRefId("company_id");

/** Governed foreign-key column for organization references. */
export const organizationIdRef = (): EntityRefColumn =>
  entityRefId("organization_id");

/** Governed foreign-key column for platform user references. */
export const userIdRef = (): EntityRefColumn => entityRefId("user_id");

/** Governed foreign-key column for role references. */
export const roleIdRef = (): EntityRefColumn => entityRefId("role_id");

/** Governed foreign-key column for permission references. */
export const permissionIdRef = (): EntityRefColumn =>
  entityRefId("permission_id");

/** Governed foreign-key column for parent organization references. */
export const parentOrganizationIdRef = (): EntityRefColumn =>
  entityRefId("parent_organization_id");

/** Governed foreign-key column for audit actor user references. */
export const actorUserIdRef = (): EntityRefColumn =>
  entityRefId("actor_user_id");

/** Governed primary key for tenant entities. */
export const tenantId = (): PrimaryIdColumn => primaryId("tenant_id");

/** Governed primary key for company entities. */
export const companyId = (): PrimaryIdColumn => primaryId("company_id");

/** Governed primary key for organization entities. */
export const organizationId = (): PrimaryIdColumn =>
  primaryId("organization_id");

/** Governed primary key for platform user entities. */
export const userId = (): PrimaryIdColumn => primaryId("user_id");

/** Governed primary key for role entities. */
export const roleId = (): PrimaryIdColumn => primaryId("role_id");

/** Governed primary key for membership entities. */
export const membershipId = (): PrimaryIdColumn => primaryId("membership_id");

/** Governed primary key for permission entities. */
export const permissionId = (): PrimaryIdColumn => primaryId("permission_id");

/** Governed primary key for policy entities. */
export const policyId = (): PrimaryIdColumn => primaryId("policy_id");

/** Governed primary key for audit event entities. */
export const auditEventId = (): PrimaryIdColumn => primaryId("audit_event_id");
