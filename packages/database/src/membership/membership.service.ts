import { and, asc, eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type {
  AuditActorType,
  MembershipScopeType,
  MembershipStatus,
  UserStatus,
} from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { isRoleScope } from "../role/role.contract.js";
import { companies } from "../schema/company.schema.js";
import { entityGroups } from "../schema/entity-group.schema.js";
import { memberships } from "../schema/membership.schema.js";
import { organizations } from "../schema/organization.schema.js";
import { projects } from "../schema/project.schema.js";
import { roles } from "../schema/role.schema.js";
import { teams } from "../schema/team.schema.js";
import { users } from "../schema/user.schema.js";
import {
  assertRoleMatchesMembershipScope,
  buildMembershipInsertRow,
  buildMembershipUpdatePatch,
  MembershipScopeMismatchError,
  type MembershipUpdatePatch,
  type MembershipWriteInput,
} from "./membership.contract.js";

export interface MembershipAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertMembershipInput = MembershipWriteInput & {
  readonly audit: MembershipAuditContext;
};

export type UpdateMembershipInput = MembershipUpdatePatch & {
  readonly audit: MembershipAuditContext;
};

export interface DeactivateMembershipInput {
  readonly audit: MembershipAuditContext;
  readonly reason?: string | null;
}

export interface MembershipMutationResult {
  readonly id: string;
}

export interface CompanyMemberListRow {
  readonly displayName: string;
  readonly email: string;
  readonly membershipId: string;
  readonly membershipStatus: MembershipStatus;
  readonly roleId: string;
  readonly roleKey: string;
  readonly roleName: string;
  readonly userId: string;
  readonly userStatus: UserStatus;
}

export interface MembershipLookupRow {
  readonly companyId: string | null;
  readonly id: string;
  readonly roleId: string;
  readonly tenantId: string;
  readonly userId: string;
}

async function assertMembershipScopeChain(
  row: Pick<
    MembershipWriteInput,
    | "tenantId"
    | "companyId"
    | "entityGroupId"
    | "organizationId"
    | "projectId"
    | "teamId"
    | "scopeType"
  >,
  db: AfendaDatabase
): Promise<void> {
  const companyId = row.companyId ?? null;
  const entityGroupId = row.entityGroupId ?? null;
  const organizationId = row.organizationId ?? null;
  const projectId = row.projectId ?? null;
  const teamId = row.teamId ?? null;

  if (entityGroupId) {
    const [entityGroup] = await db
      .select({ tenantId: entityGroups.tenantId })
      .from(entityGroups)
      .where(eq(entityGroups.id, entityGroupId))
      .limit(1);

    if (!entityGroup || entityGroup.tenantId !== row.tenantId) {
      throw new MembershipScopeMismatchError(
        "Membership entity group must belong to the membership tenant."
      );
    }
  }

  if (projectId) {
    const [project] = await db
      .select({ tenantId: projects.tenantId })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project || project.tenantId !== row.tenantId) {
      throw new MembershipScopeMismatchError(
        "Membership project must belong to the membership tenant."
      );
    }
  }

  if (teamId) {
    const [team] = await db
      .select({ tenantId: teams.tenantId })
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team || team.tenantId !== row.tenantId) {
      throw new MembershipScopeMismatchError(
        "Membership team must belong to the membership tenant."
      );
    }
  }

  if (companyId) {
    const [company] = await db
      .select({ tenantId: companies.tenantId })
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!company || company.tenantId !== row.tenantId) {
      throw new MembershipScopeMismatchError(
        "Membership company must belong to the membership tenant."
      );
    }
  }

  if (organizationId) {
    const [organization] = await db
      .select({
        tenantId: organizations.tenantId,
        companyId: organizations.companyId,
      })
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (!organization || organization.tenantId !== row.tenantId) {
      throw new MembershipScopeMismatchError(
        "Membership organization must belong to the membership tenant."
      );
    }

    if (!companyId || organization.companyId !== companyId) {
      throw new MembershipScopeMismatchError(
        "Membership organization must belong to the membership company."
      );
    }
  }
}

async function assertRoleGrantValid(
  row: Pick<MembershipWriteInput, "tenantId" | "roleId" | "scopeType">,
  db: AfendaDatabase
): Promise<void> {
  const [role] = await db
    .select({
      scope: roles.scope,
      tenantId: roles.tenantId,
      status: roles.status,
    })
    .from(roles)
    .where(eq(roles.id, row.roleId))
    .limit(1);

  if (!role) {
    throw new Error(`Role "${row.roleId}" was not found.`);
  }

  if (role.status !== "active") {
    throw new MembershipScopeMismatchError(
      "Only active roles can be assigned to memberships."
    );
  }

  if (!isRoleScope(role.scope)) {
    throw new MembershipScopeMismatchError(
      `Role "${row.roleId}" has an invalid scope "${role.scope}".`
    );
  }

  assertRoleMatchesMembershipScope(row.scopeType, role.scope);

  if (role.scope !== "platform" && role.tenantId !== row.tenantId) {
    throw new MembershipScopeMismatchError(
      "Role tenant must match membership tenant."
    );
  }
}

async function recordMembershipAuditEvent(
  action: "membership.create" | "membership.update" | "membership.deactivate",
  membershipId: string,
  tenantId: string,
  companyId: string | null,
  organizationId: string | null,
  audit: MembershipAuditContext,
  metadata: Record<string, string | null>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      tenantId,
      companyId,
      organizationId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action,
      targetType: "membership",
      targetId: membershipId,
      result: "success",
      source: audit.source ?? "app",
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      userAgent: audit.userAgent ?? null,
      metadata,
    },
    db
  );
}

export async function insertMembership(
  input: InsertMembershipInput,
  db: AfendaDatabase = getDb()
): Promise<MembershipMutationResult> {
  const row = buildMembershipInsertRow(input);

  await assertMembershipScopeChain(row, db);
  await assertRoleGrantValid(row, db);

  const [inserted] = await db.insert(memberships).values(row).returning({
    id: memberships.id,
    tenantId: memberships.tenantId,
    companyId: memberships.companyId,
    organizationId: memberships.organizationId,
  });

  if (!inserted) {
    throw new Error("Membership insert did not return a row id.");
  }

  await recordMembershipAuditEvent(
    "membership.create",
    inserted.id,
    inserted.tenantId,
    inserted.companyId,
    inserted.organizationId,
    input.audit,
    {
      userId: row.userId,
      roleId: row.roleId,
      scopeType: row.scopeType,
      status: row.status,
    },
    db
  );

  return { id: inserted.id };
}

export async function updateMembership(
  membershipId: string,
  input: UpdateMembershipInput,
  db: AfendaDatabase = getDb()
): Promise<MembershipMutationResult> {
  const patch = buildMembershipUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Membership update requires at least one field.");
  }

  const [existing] = await db
    .select({
      tenantId: memberships.tenantId,
      companyId: memberships.companyId,
      organizationId: memberships.organizationId,
      scopeType: memberships.scopeType,
    })
    .from(memberships)
    .where(eq(memberships.id, membershipId))
    .limit(1);

  if (!existing) {
    throw new Error(`Membership "${membershipId}" was not found.`);
  }

  if (patch.roleId) {
    await assertRoleGrantValid(
      {
        tenantId: existing.tenantId,
        roleId: patch.roleId,
        scopeType: existing.scopeType,
      },
      db
    );
  }

  const [updated] = await db
    .update(memberships)
    .set(patch)
    .where(eq(memberships.id, membershipId))
    .returning({
      id: memberships.id,
      tenantId: memberships.tenantId,
      companyId: memberships.companyId,
      organizationId: memberships.organizationId,
    });

  if (!updated) {
    throw new Error(`Membership "${membershipId}" was not found.`);
  }

  await recordMembershipAuditEvent(
    "membership.update",
    updated.id,
    updated.tenantId,
    updated.companyId,
    updated.organizationId,
    input.audit,
    {
      roleId: patch.roleId ?? null,
      status: patch.status ?? null,
    },
    db
  );

  return { id: updated.id };
}

/** Deactivates access by status change. Hard delete is prohibited. */
export async function deactivateMembership(
  membershipId: string,
  input: DeactivateMembershipInput,
  db: AfendaDatabase = getDb()
): Promise<MembershipMutationResult> {
  const [existing] = await db
    .select({
      id: memberships.id,
      tenantId: memberships.tenantId,
      companyId: memberships.companyId,
      organizationId: memberships.organizationId,
    })
    .from(memberships)
    .where(
      and(eq(memberships.id, membershipId), eq(memberships.status, "active"))
    )
    .limit(1);

  if (!existing) {
    throw new Error(`Active membership "${membershipId}" was not found.`);
  }

  const [updated] = await db
    .update(memberships)
    .set({ status: "revoked" })
    .where(eq(memberships.id, membershipId))
    .returning({
      id: memberships.id,
      tenantId: memberships.tenantId,
      companyId: memberships.companyId,
      organizationId: memberships.organizationId,
    });

  if (!updated) {
    throw new Error(`Membership "${membershipId}" was not found.`);
  }

  await recordMembershipAuditEvent(
    "membership.deactivate",
    updated.id,
    updated.tenantId,
    updated.companyId,
    updated.organizationId,
    input.audit,
    {
      reason: input.reason ?? null,
      status: "revoked",
    },
    db
  );

  return { id: updated.id };
}

/** Lists active company-scoped members with user and role display fields. */
export async function listCompanyMembers(
  input: {
    readonly companyId: string;
    readonly tenantId: string;
  },
  db: AfendaDatabase = getDb()
): Promise<CompanyMemberListRow[]> {
  return db
    .select({
      displayName: users.displayName,
      email: users.email,
      membershipId: memberships.id,
      membershipStatus: memberships.status,
      roleId: roles.id,
      roleKey: roles.key,
      roleName: roles.name,
      userId: users.id,
      userStatus: users.status,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .innerJoin(roles, eq(memberships.roleId, roles.id))
    .where(
      and(
        eq(memberships.tenantId, input.tenantId),
        eq(memberships.companyId, input.companyId),
        eq(memberships.scopeType, "company"),
        eq(memberships.status, "active"),
        eq(users.status, "active")
      )
    )
    .orderBy(asc(users.displayName), asc(users.email));
}

/** Read-only membership lookup for invite enrichment and admin actions. */
export async function findMembershipById(
  membershipId: string,
  db: AfendaDatabase = getDb()
): Promise<MembershipLookupRow | null> {
  const [row] = await db
    .select({
      companyId: memberships.companyId,
      id: memberships.id,
      roleId: memberships.roleId,
      tenantId: memberships.tenantId,
      userId: memberships.userId,
    })
    .from(memberships)
    .where(eq(memberships.id, membershipId))
    .limit(1);

  return row ?? null;
}

export interface ActiveCompanyMembershipLookupRow {
  readonly membershipEnterpriseId: string;
  readonly roleEnterpriseId: string;
  readonly scopeType: MembershipScopeType;
}

/** Resolves an active company-scoped membership for a platform user. */
export async function findActiveCompanyMembershipForUser(
  input: { readonly companyId: string; readonly userId: string },
  db: AfendaDatabase = getDb()
): Promise<ActiveCompanyMembershipLookupRow | null> {
  const [row] = await db
    .select({
      membershipEnterpriseId: memberships.enterpriseId,
      roleEnterpriseId: roles.enterpriseId,
      scopeType: memberships.scopeType,
    })
    .from(memberships)
    .innerJoin(roles, eq(memberships.roleId, roles.id))
    .where(
      and(
        eq(memberships.userId, input.userId),
        eq(memberships.companyId, input.companyId),
        eq(memberships.status, "active")
      )
    )
    .limit(1);

  if (
    row === undefined ||
    row.membershipEnterpriseId === null ||
    row.roleEnterpriseId === null
  ) {
    return null;
  }

  return {
    membershipEnterpriseId: row.membershipEnterpriseId,
    roleEnterpriseId: row.roleEnterpriseId,
    scopeType: row.scopeType,
  };
}
