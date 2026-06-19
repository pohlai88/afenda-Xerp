/** Afenda platform database foundation (TIP-003). */
export const PACKAGE_NAME = "@afenda/database" as const;

export {
  type AfendaAuthDatabase,
  type CreateAuthDbOptions,
  createAuthDb,
} from "./auth-db.js";
export {
  type AuditResult,
  type CompanyStatus,
  createPermissionKey,
  InvalidPermissionKeyError,
  type MembershipStatus,
  type OrganizationStatus,
  type OrganizationType,
  type PermissionKey,
  type PolicyEffect,
  type PolicyStatus,
  type RoleScope,
  type RoleStatus,
  type TenantStatus,
  type UserStatus,
} from "./database.types.js";
export {
  type AfendaDatabase,
  type CreateDbOptions,
  createDb,
  createDbPool,
  schema,
} from "./db.js";
export {
  buildSupabaseDatabaseUrl,
  getDatabaseUrl,
  getDatabaseUrlForMethod,
  getDedicatedDatabaseUrl,
  getDirectDatabaseUrl,
  getSessionDatabaseUrl,
  getSupabaseDbPassword,
  getSupabaseDbRegion,
  getSupabasePoolerHost,
  getSupabaseProjectRef,
  getTransactionDatabaseUrl,
  hasDatabaseUrl,
  hasSupabaseDatabaseConfig,
  MissingDatabaseUrlError,
  MissingSupabaseDbPasswordError,
  MissingSupabaseDbRegionError,
  MissingSupabaseProjectRefError,
  type SupabaseConnectionMethod,
} from "./env.js";
export { primaryId } from "./ids.js";
export {
  type AuthSchema,
  auditEvents,
  auditResultEnum,
  authAccount,
  authSchema,
  authSession,
  authUser,
  authVerification,
  companies,
  companyStatusEnum,
  membershipStatusEnum,
  memberships,
  organizationStatusEnum,
  organizations,
  organizationTypeEnum,
  type PlatformSchema,
  permissions,
  platformSchema,
  policies,
  policyEffectEnum,
  policyStatusEnum,
  roleScopeEnum,
  roleStatusEnum,
  roles,
  tenantStatusEnum,
  tenants,
  userStatusEnum,
  users,
} from "./schema/index.js";
export { createdAtColumn, updatedAtColumn } from "./timestamps.js";

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}
