/**
 * Tenant-scoped system-admin settings document (ARCH-ADMIN-001 Slice 1).
 *
 * Writes: `../tenant-settings/tenant-settings.service.ts`
 * Contract: `../tenant-settings/tenant-settings.contract.ts`
 */
import { index, jsonb, pgTable, uniqueIndex } from "drizzle-orm/pg-core";

import { primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

export const tenantSettings = pgTable(
  "tenant_settings",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    notifications: jsonb("notifications").notNull().default({}),
    workspace: jsonb("workspace").notNull().default({}),
    billing: jsonb("billing").notNull().default({}),
    appearance: jsonb("appearance").notNull().default({}),
    integrations: jsonb("integrations").notNull().default({}),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("tenant_settings_tenant_id_uidx").on(table.tenantId),
    index("tenant_settings_tenant_id_idx").on(table.tenantId),
  ]
);
