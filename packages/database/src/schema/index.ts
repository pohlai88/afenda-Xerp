import { auditEvents } from "./audit.schema.js";
import { authIdentityLinks } from "./auth-identity-link.schema.js";
import { companies } from "./company.schema.js";
import {
  entitlementGrants,
  tenantCommercialPlans,
  usageLimitCounters,
} from "./entitlement.schema.js";
import { executionRuns } from "./execution.schema.js";
import { memberships } from "./membership.schema.js";
import { organizations } from "./organization.schema.js";
import { permissions } from "./permission.schema.js";
import { policies } from "./policy.schema.js";
import { roles } from "./role.schema.js";
import { rolePermissions } from "./role-permission.schema.js";
import {
  platformFeatureFlags,
  platformKillSwitches,
} from "./rollout.schema.js";
import { storageObjects } from "./storage.schema.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

/** Single schema registry for Drizzle client wiring and type inference. */
export const platformSchema = {
  auditEvents,
  authIdentityLinks,
  companies,
  entitlementGrants,
  executionRuns,
  memberships,
  organizations,
  permissions,
  platformFeatureFlags,
  platformKillSwitches,
  policies,
  rolePermissions,
  roles,
  storageObjects,
  tenantCommercialPlans,
  tenants,
  usageLimitCounters,
  users,
} as const;

export type PlatformSchema = typeof platformSchema;

export {
  auditActorTypeEnum,
  auditResultEnum,
  auditSourceEnum,
  companyStatusEnum,
  entitlementScopeEnum,
  entitlementTypeEnum,
  featureFlagRolloutEnum,
  killSwitchSeverityEnum,
  membershipScopeEnum,
  membershipStatusEnum,
  organizationStatusEnum,
  organizationTypeEnum,
  policyEffectEnum,
  policyScopeEnum,
  policyStatusEnum,
  roleScopeEnum,
  roleStatusEnum,
  storageProviderEnum,
  executionStatusEnum,
  tenantStatusEnum,
  usageLimitPeriodEnum,
  userStatusEnum,
} from "../database.types.js";

export { auditEvents } from "./audit.schema.js";
export {
  type AuthSchema,
  authAccount,
  authSchema,
  authSession,
  authUser,
  authVerification,
} from "./auth.schema.js";
export { authIdentityLinks } from "./auth-identity-link.schema.js";
export { companies } from "./company.schema.js";
export {
  entitlementGrants,
  tenantCommercialPlans,
  usageLimitCounters,
} from "./entitlement.schema.js";
export { executionRuns } from "./execution.schema.js";
export { memberships } from "./membership.schema.js";
export { organizations } from "./organization.schema.js";
export { permissions } from "./permission.schema.js";
export { policies } from "./policy.schema.js";
export { roles } from "./role.schema.js";
export { rolePermissions } from "./role-permission.schema.js";
export {
  platformFeatureFlags,
  platformKillSwitches,
} from "./rollout.schema.js";
export { storageObjects } from "./storage.schema.js";
export { tenants } from "./tenant.schema.js";
export { users } from "./user.schema.js";
