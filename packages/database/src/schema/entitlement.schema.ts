/**
 * Commercial entitlement grants and usage-limit counters (Foundation phase 08).
 *
 * Writes: `../entitlement/entitlement-provision.service.ts`
 * Reads: `../entitlement/entitlement-load.service.ts`
 */
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import {
  entitlementScopeEnum,
  entitlementTypeEnum,
  usageLimitPeriodEnum,
} from "../database.types.js";
import { companyIdRef, primaryId, tenantIdRef } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { tenants } from "./tenant.schema.js";

export const entitlementGrants = pgTable(
  "entitlement_grants",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "cascade",
    }),
    key: varchar("key", { length: 191 }).notNull(),
    type: entitlementTypeEnum("type").notNull(),
    scope: entitlementScopeEnum("scope").notNull(),
    environment: varchar("environment", { length: 32 }),
    enabled: boolean("enabled").notNull().default(true),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("entitlement_grants_tenant_key_uidx").on(
      table.tenantId,
      table.key
    ),
    index("entitlement_grants_tenant_id_idx").on(table.tenantId),
    index("entitlement_grants_company_id_idx").on(table.companyId),
  ]
);

export const usageLimitCounters = pgTable(
  "usage_limit_counters",
  {
    id: primaryId(),
    tenantId: tenantIdRef()
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 64 }).notNull(),
    scope: entitlementScopeEnum("scope").notNull(),
    period: usageLimitPeriodEnum("period").notNull(),
    maximum: integer("maximum").notNull(),
    used: integer("used").notNull().default(0),
    unit: varchar("unit", { length: 32 }).notNull(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("usage_limit_counters_tenant_key_uidx").on(
      table.tenantId,
      table.key
    ),
    index("usage_limit_counters_tenant_id_idx").on(table.tenantId),
  ]
);

export const tenantCommercialPlans = pgTable(
  "tenant_commercial_plans",
  {
    tenantId: tenantIdRef()
      .primaryKey()
      .references(() => tenants.id, { onDelete: "cascade" }),
    planTemplateId: varchar("plan_template_id", { length: 32 }).notNull(),
    correlationId: varchar("correlation_id", { length: 128 }).notNull(),
    provisionedAt: createdAtColumn("provisioned_at"),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    index("tenant_commercial_plans_template_idx").on(table.planTemplateId),
  ]
);
