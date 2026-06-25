import { registerAuthInvitation, syncAuthMirrorUser } from "@afenda/auth";
import { insertMembership, insertUser } from "@afenda/database";

export async function inviteCompanyUser(input: {
  readonly actorUserId: string;
  readonly companyId: string;
  readonly correlationId: string;
  readonly displayName: string;
  readonly email: string;
  readonly roleId: string;
  readonly tenantId: string;
}): Promise<{ readonly membershipId: string; readonly userId: string }> {
  const user = await insertUser({
    audit: {
      actorType: "user",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
      source: "api",
    },
    displayName: input.displayName,
    email: input.email,
    status: "invited",
  });

  const membership = await insertMembership({
    audit: {
      actorType: "user",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
      source: "api",
    },
    companyId: input.companyId,
    organizationId: null,
    roleId: input.roleId,
    scopeType: "company",
    tenantId: input.tenantId,
    userId: user.id,
  });

  await syncAuthMirrorUser({
    displayName: input.displayName,
    email: input.email,
    userId: user.id,
  });

  await registerAuthInvitation({
    email: input.email,
    invitationId: membership.id,
    platformUserId: user.id,
    tenantId: input.tenantId,
  });

  return {
    membershipId: membership.id,
    userId: user.id,
  };
}
