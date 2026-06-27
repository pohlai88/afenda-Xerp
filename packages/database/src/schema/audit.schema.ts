import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import {
  auditActorTypeEnum,
  auditResultEnum,
  auditSourceEnum,
} from "../database.types.js";
import {
  actorUserIdRef,
  companyIdRef,
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  organizationIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { tenants } from "./tenant.schema.js";
import { users } from "./user.schema.js";

/**
 * Append-only execution evidence ledger (Postgres table definition).
 *
 * Write path: `src/audit/audit.writer.ts` → `insertAuditEvent()` only.
 * Do not update or delete rows from application code.
 */
export const auditEvents = pgTable(
  "audit_events",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("auditEvent"),
    tenantId: tenantIdRef().references(() => tenants.id, {
      onDelete: "set null",
    }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "set null",
    }),
    organizationId: organizationIdRef().references(() => organizations.id, {
      onDelete: "set null",
    }),
    actorType: auditActorTypeEnum("actor_type").notNull(),
    actorId: varchar("actor_id", { length: 191 }).notNull(),
    actorUserId: actorUserIdRef().references(() => users.id, {
      onDelete: "set null",
    }),
    module: varchar("module", { length: 64 }).notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    targetType: varchar("target_type", { length: 64 }).notNull(),
    targetId: varchar("target_id", { length: 128 }),
    result: auditResultEnum("result").notNull(),
    reason: text("reason"),
    permission: varchar("permission", { length: 128 }),
    policyId: varchar("policy_id", { length: 128 }),
    source: auditSourceEnum("source").notNull().default("api"),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    correlationId: varchar("correlation_id", { length: 128 }).notNull(),
    eventVersion: varchar("event_version", { length: 16 })
      .notNull()
      .default("1.0"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("audit_events_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "auditEvent"),
    index("audit_events_tenant_id_idx").on(table.tenantId),
    index("audit_events_company_id_idx").on(table.companyId),
    index("audit_events_organization_id_idx").on(table.organizationId),
    index("audit_events_actor_id_idx").on(table.actorId),
    index("audit_events_actor_user_id_idx").on(table.actorUserId),
    index("audit_events_correlation_id_idx").on(table.correlationId),
    index("audit_events_target_idx").on(table.targetType, table.targetId),
    index("audit_events_created_at_idx").on(table.createdAt),
    index("audit_events_tenant_created_at_idx").on(
      table.tenantId,
      table.createdAt
    ),
    index("audit_events_org_created_at_idx").on(
      table.organizationId,
      table.createdAt
    ),
    index("audit_events_actor_created_at_idx").on(
      table.actorUserId,
      table.createdAt
    ),
    index("audit_events_module_action_idx").on(table.module, table.action),
  ]
);
