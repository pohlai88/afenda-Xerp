/**
 * Platform rollout store — feature flags and kill switches (Foundation phase 08).
 *
 * Writes: `../entitlement/rollout-sync.service.ts`
 * Reads: `../entitlement/rollout-load.service.ts`
 */
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import {
  featureFlagRolloutEnum,
  killSwitchSeverityEnum,
} from "../database.types.js";
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

export const platformFeatureFlags = pgTable(
  "platform_feature_flags",
  {
    id: primaryId(),
    key: varchar("key", { length: 128 }).notNull(),
    enabled: boolean("enabled").notNull().default(true),
    rollout: featureFlagRolloutEnum("rollout").notNull(),
    environments: jsonb("environments").notNull().default([]),
    tenantAllowlist: jsonb("tenant_allowlist").notNull().default([]),
    companyAllowlist: jsonb("company_allowlist").notNull().default([]),
    killSwitchKey: varchar("kill_switch_key", { length: 128 }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("platform_feature_flags_key_uidx").on(table.key),
    index("platform_feature_flags_rollout_idx").on(table.rollout),
  ]
);

export const platformKillSwitches = pgTable(
  "platform_kill_switches",
  {
    key: varchar("key", { length: 128 }).primaryKey(),
    active: boolean("active").notNull().default(false),
    severity: killSwitchSeverityEnum("severity").notNull(),
    reason: text("reason").notNull().default(""),
    activatedBy: varchar("activated_by", { length: 128 }),
    activatedAt: timestamp("activated_at", {
      withTimezone: true,
      mode: "date",
    }),
    updatedAt: updatedAtColumn(),
  },
  (table) => [index("platform_kill_switches_active_idx").on(table.active)]
);
