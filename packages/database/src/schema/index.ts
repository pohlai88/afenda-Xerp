import { auditEvents } from "./audit.schema.js";
import { authIdentityLinks } from "./auth-identity-link.schema.js";
import { companies } from "./company.schema.js";
import { memberships } from "./membership.schema.js";
import { organizations } from "./organization.schema.js";
import { permissions } from "./permission.schema.js";
import { policies } from "./policy.schema.js";
import { roles } from "./role.schema.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

/** Single schema registry for Drizzle client wiring and type inference. */
export const platformSchema = {
  auditEvents,
  authIdentityLinks,
  companies,
  memberships,
  organizations,
  permissions,
  policies,
  roles,
  tenants,
  users,
} as const;

export type PlatformSchema = typeof platformSchema;

export {
  auditActorTypeEnum,
  auditResultEnum,
  companyStatusEnum,
  membershipScopeEnum,
  membershipStatusEnum,
  organizationStatusEnum,
  organizationTypeEnum,
  policyEffectEnum,
  policyScopeEnum,
  policyStatusEnum,
  roleScopeEnum,
  roleStatusEnum,
  tenantStatusEnum,
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
export { memberships } from "./membership.schema.js";
export { organizations } from "./organization.schema.js";
export { permissions } from "./permission.schema.js";
export { policies } from "./policy.schema.js";
export { roles } from "./role.schema.js";
export { tenants } from "./tenant.schema.js";
export { users } from "./user.schema.js";
