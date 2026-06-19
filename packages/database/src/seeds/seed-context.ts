import { randomUUID } from "node:crypto";
import type { CompanyAuditContext } from "../company/company.service.js";
import type { AuditActorType } from "../database.types.js";
import type { MembershipAuditContext } from "../membership/membership.service.js";
import type { OrganizationAuditContext } from "../organization/organization.service.js";
import type { PermissionAuditContext } from "../permission/permission.service.js";
import type { PolicyAuditContext } from "../policy/policy.service.js";
import type { RoleAuditContext } from "../role/role.service.js";
import type { RolePermissionAuditContext } from "../role-permission/role-permission.service.js";
import type { TenantAuditContext } from "../tenant/tenant.service.js";
import type { UserAuditContext } from "../user/user.service.js";
import type { SeedProfile } from "./seed-types.js";

export interface SeedAuditBundle {
  readonly actorType: AuditActorType;
  readonly company: CompanyAuditContext;
  readonly correlationId: string;
  readonly membership: MembershipAuditContext;
  readonly organization: OrganizationAuditContext;
  readonly permission: PermissionAuditContext;
  readonly policy: PolicyAuditContext;
  readonly role: RoleAuditContext;
  readonly rolePermission: RolePermissionAuditContext;
  readonly tenant: TenantAuditContext;
  readonly user: UserAuditContext;
}

function createAuditContext(correlationId: string): {
  actorType: AuditActorType;
  correlationId: string;
  source: "system";
} {
  return {
    actorType: "system",
    correlationId,
    source: "system",
  };
}

/** Creates correlated audit contexts for governed seed writes. */
export function createSeedAuditBundle(profile: SeedProfile): SeedAuditBundle {
  const correlationId = `seed-${profile}-${randomUUID()}`;
  const base = createAuditContext(correlationId);

  return {
    actorType: base.actorType,
    correlationId,
    permission: base,
    role: base,
    rolePermission: {
      ...base,
      reason: `${profile} seed`,
    },
    policy: base,
    tenant: base,
    company: base,
    organization: base,
    user: base,
    membership: base,
  };
}
