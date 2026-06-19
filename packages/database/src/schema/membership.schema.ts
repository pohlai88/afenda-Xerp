/**
 * Postgres table definition for `memberships` (Drizzle only).
 *
 * Writes: `../membership/membership.service.ts`
 */
import { sql } from "drizzle-orm";
import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import {
  membershipScopeEnum,
  membershipStatusEnum,
} from "../database.types.js";
import {
  companyIdRef,
  organizationIdRef,
  primaryId,
  roleIdRef,
  tenantIdRef,
  userIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { roles } from "./role.schema.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

/**
 * Authority grant binding a user to a role within an explicit scope.
 *
 * Writes must go through `insertMembership()` / `updateMembership()` /
 * `deactivateMembership()` only. Do not hard-delete memberships.
 */
export const memberships = pgTable(
  "memberships",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "restrict",
    }),
    organizationId: organizationIdRef().references(() => organizations.id, {
      onDelete: "restrict",
    }),
    userId: userIdRef()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: roleIdRef()
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    scopeType: membershipScopeEnum("scope_type").notNull(),
    status: membershipStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("memberships_tenant_scope_unique")
      .on(table.userId, table.tenantId, table.roleId)
      .where(sql`${table.scopeType} = 'tenant'`),
    uniqueIndex("memberships_company_scope_unique")
      .on(table.userId, table.tenantId, table.companyId, table.roleId)
      .where(sql`${table.scopeType} = 'company'`),
    uniqueIndex("memberships_organization_scope_unique")
      .on(table.userId, table.tenantId, table.organizationId, table.roleId)
      .where(sql`${table.scopeType} = 'organization'`),
    index("memberships_tenant_id_idx").on(table.tenantId),
    index("memberships_company_id_idx").on(table.companyId),
    index("memberships_organization_id_idx").on(table.organizationId),
    index("memberships_user_id_idx").on(table.userId),
    index("memberships_role_id_idx").on(table.roleId),
    index("memberships_user_status_idx").on(table.userId, table.status),
    index("memberships_user_tenant_status_idx").on(
      table.userId,
      table.tenantId,
      table.status
    ),
    index("memberships_user_company_status_idx").on(
      table.userId,
      table.companyId,
      table.status
    ),
    index("memberships_user_organization_status_idx").on(
      table.userId,
      table.organizationId,
      table.status
    ),
  ]
);
