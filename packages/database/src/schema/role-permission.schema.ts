/**
 * Role-to-permission grant junction (read-heavy; writes via `role-permission.service.ts`).
 *
 * Golden rule: role is the authority template; this table binds capabilities to roles.
 */
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { permissionIdRef, roleIdRef } from "../ids.js";
import { createdAtColumn } from "../timestamps.js";
import { permissions } from "./permission.schema.js";
import { roles } from "./role.schema.js";

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: roleIdRef()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: permissionIdRef()
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
  ]
);
