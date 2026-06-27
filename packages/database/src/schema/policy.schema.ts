/**
 * Postgres table definition for `policies` (Drizzle only).
 *
 * Writes: `../policy/policy.service.ts`
 * Validation: `../policy/policy.validation.ts`
 */
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import {
  policyEffectEnum,
  policyScopeEnum,
  policyStatusEnum,
} from "../database.types.js";
import {
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { tenants } from "./tenant.schema.js";

/**
 * Authority decision template — not the grant.
 *
 * Golden rule: role grants capability; policy decides whether capability may
 * execute.
 *
 * Writes must go through `insertPolicy()` / `updatePolicy()` / `archivePolicy()`.
 * Policy key, tenantId, and scope are immutable after create.
 */
export const policies = pgTable(
  "policies",
  {
    id: primaryId(),
    enterpriseId: enterpriseIdColumn("policy"),
    tenantId: tenantIdRef().references(() => tenants.id, {
      onDelete: "restrict",
    }),
    key: varchar("key", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    scope: policyScopeEnum("scope").notNull(),
    effect: policyEffectEnum("effect").notNull(),
    priority: integer("priority").notNull().default(100),
    condition: jsonb("condition").notNull().default({}),
    status: policyStatusEnum("status").notNull().default("active"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("policies_enterprise_id_unique").on(table.enterpriseId),
    enterpriseIdFormatCheck(table.enterpriseId, "policy"),
    uniqueIndex("policies_platform_key_unique")
      .on(table.key)
      .where(sql`${table.tenantId} is null`),
    uniqueIndex("policies_tenant_key_unique")
      .on(table.tenantId, table.key)
      .where(sql`${table.tenantId} is not null`),
    index("policies_tenant_id_idx").on(table.tenantId),
    index("policies_status_idx").on(table.status),
    index("policies_tenant_status_idx").on(table.tenantId, table.status),
    index("policies_tenant_scope_status_idx").on(
      table.tenantId,
      table.scope,
      table.status
    ),
    index("policies_effect_status_idx").on(table.effect, table.status),
  ]
);
