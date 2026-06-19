import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { auditResultEnum } from "../database.types.js";
import { primaryId } from "../ids.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

export const auditEvents = pgTable(
  "audit_events",
  {
    id: primaryId(),
    tenantId: uuid("tenant_id").references(() => tenants.id, {
      onDelete: "set null",
    }),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    module: varchar("module", { length: 64 }).notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    targetType: varchar("target_type", { length: 64 }).notNull(),
    targetId: varchar("target_id", { length: 128 }),
    result: auditResultEnum("result").notNull(),
    reason: text("reason"),
    correlationId: varchar("correlation_id", { length: 128 }).notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_events_tenant_id_idx").on(table.tenantId),
    index("audit_events_company_id_idx").on(table.companyId),
    index("audit_events_organization_id_idx").on(table.organizationId),
    index("audit_events_actor_user_id_idx").on(table.actorUserId),
    index("audit_events_correlation_id_idx").on(table.correlationId),
    index("audit_events_target_idx").on(table.targetType, table.targetId),
    index("audit_events_created_at_idx").on(table.createdAt),
  ]
);
