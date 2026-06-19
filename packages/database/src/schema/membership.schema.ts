import { index, pgTable, uuid } from "drizzle-orm/pg-core";
import { membershipStatusEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { roles } from "./role.schema.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

export const memberships = pgTable(
  "memberships",
  {
    id: primaryId(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    status: membershipStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn,
    updatedAt: updatedAtColumn,
  },
  (table) => [
    index("memberships_tenant_id_idx").on(table.tenantId),
    index("memberships_company_id_idx").on(table.companyId),
    index("memberships_organization_id_idx").on(table.organizationId),
    index("memberships_user_id_idx").on(table.userId),
    index("memberships_role_id_idx").on(table.roleId),
    index("memberships_status_idx").on(table.status),
  ]
);
