import { auditEvents } from "./audit.schema.js";
import { authIdentityLinks } from "./auth-identity-link.schema.js";
import { companies } from "./company.schema.js";
import {
  entitlementGrants,
  tenantCommercialPlans,
  usageLimitCounters,
} from "./entitlement.schema.js";
import { entityGroups } from "./entity-group.schema.js";
import { executionRuns } from "./execution.schema.js";
import { legalEntityOwnership } from "./legal-entity-ownership.schema.js";
import { memberships } from "./membership.schema.js";
import { organizations } from "./organization.schema.js";
import { outboxEvents } from "./outbox.schema.js";
import { permissions } from "./permission.schema.js";
import { policies } from "./policy.schema.js";
import { projects } from "./project.schema.js";
import { roles } from "./role.schema.js";
import { rolePermissions } from "./role-permission.schema.js";
import {
  platformFeatureFlags,
  platformKillSwitches,
} from "./rollout.schema.js";
import { storageObjects } from "./storage.schema.js";
import { teams } from "./team.schema.js";
import { tenants } from "./tenant.schema.js";
import { tenantSettings } from "./tenant-settings.schema.js";
import { users } from "./user.schema.js";
import { userPreferences } from "./user-preferences.schema.js";

/** Single schema registry for Drizzle client wiring and type inference. */
export const platformSchema = {
  auditEvents,
  authIdentityLinks,
  companies,
  entityGroups,
  entitlementGrants,
  executionRuns,
  legalEntityOwnership,
  outboxEvents,
  memberships,
  organizations,
  permissions,
  platformFeatureFlags,
  platformKillSwitches,
  policies,
  projects,
  rolePermissions,
  roles,
  storageObjects,
  teams,
  tenantCommercialPlans,
  tenantSettings,
  tenants,
  usageLimitCounters,
  userPreferences,
  users,
} as const;

export type PlatformSchema = typeof platformSchema;

export {
  auditActorTypeEnum,
  auditResultEnum,
  auditSourceEnum,
  companyStatusEnum,
  consolidationMethodEnum,
  entitlementScopeEnum,
  entitlementTypeEnum,
  executionStatusEnum,
  featureFlagRolloutEnum,
  killSwitchSeverityEnum,
  LEGAL_ENTITY_COMPANY_TYPES,
  legalEntityCompanyTypeEnum,
  membershipScopeEnum,
  membershipStatusEnum,
  organizationStatusEnum,
  organizationTypeEnum,
  ownershipControlTypeEnum,
  ownershipRelationshipTypeEnum,
  policyEffectEnum,
  policyScopeEnum,
  policyStatusEnum,
  projectLifecycleStatusEnum,
  roleScopeEnum,
  roleStatusEnum,
  storageProviderEnum,
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
  authTwoFactor,
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
export { entityGroups } from "./entity-group.schema.js";
export { executionRuns } from "./execution.schema.js";
export { legalEntityOwnership } from "./legal-entity-ownership.schema.js";
export { memberships } from "./membership.schema.js";
export { organizations } from "./organization.schema.js";
export {
  OUTBOX_STATUSES,
  type OutboxStatus,
  outboxEvents,
  outboxStatusEnum,
} from "./outbox.schema.js";
export { permissions } from "./permission.schema.js";
export { policies } from "./policy.schema.js";
export { projects } from "./project.schema.js";
export { roles } from "./role.schema.js";
export { rolePermissions } from "./role-permission.schema.js";
export {
  platformFeatureFlags,
  platformKillSwitches,
} from "./rollout.schema.js";
export { storageObjects } from "./storage.schema.js";
export { teams } from "./team.schema.js";
export { tenants } from "./tenant.schema.js";
export { tenantSettings } from "./tenant-settings.schema.js";
export { users } from "./user.schema.js";
export { userPreferences } from "./user-preferences.schema.js";
