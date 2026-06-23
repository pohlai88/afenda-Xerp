/**
 * Durable governed outbox for asynchronous event dispatch.
 *
 * Write path: protected mutations enqueue rows in the same transaction as domain
 * commits. Dispatch lifecycle (poll, lock, publish, retry) stays in
 * `@afenda/execution` publish worker (TIP-011 Slice 2).
 */
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { auditActorTypeEnum } from "../database.types.js";
import {
  companyIdRef,
  entityRefId,
  organizationIdRef,
  primaryId,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { executionRuns } from "./execution.schema.js";
import { organizations } from "./organization.schema.js";
import { tenants } from "./tenant.schema.js";

export const OUTBOX_STATUSES = [
  "pending",
  "processing",
  "published",
  "failed",
  "dead_letter",
] as const;

export type OutboxStatus = (typeof OUTBOX_STATUSES)[number];

export const outboxStatusEnum = pgEnum("outbox_status", OUTBOX_STATUSES);

const DEFAULT_MAX_ATTEMPTS = 5;

export const outboxEvents = pgTable(
  "outbox_events",
  {
    id: primaryId(),
    eventId: varchar("event_id", { length: 191 }).notNull(),
    eventType: varchar("event_type", { length: 191 }).notNull(),
    eventVersion: varchar("event_version", { length: 16 })
      .notNull()
      .default("1.0"),
    tenantId: tenantIdRef().references(() => tenants.id, {
      onDelete: "set null",
    }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "set null",
    }),
    organizationId: organizationIdRef().references(() => organizations.id, {
      onDelete: "set null",
    }),
    correlationId: varchar("correlation_id", { length: 191 }).notNull(),
    causationId: varchar("causation_id", { length: 191 }),
    executionRunId: entityRefId("execution_run_id").references(
      () => executionRuns.executionId,
      { onDelete: "set null" }
    ),
    actorType: auditActorTypeEnum("actor_type"),
    actorId: varchar("actor_id", { length: 191 }),
    reason: text("reason"),
    summary: text("summary"),
    payload: jsonb("payload").notNull().default({}),
    metadata: jsonb("metadata").notNull().default({}),
    status: outboxStatusEnum("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts")
      .notNull()
      .default(DEFAULT_MAX_ATTEMPTS),
    availableAt: timestamp("available_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    lockedAt: timestamp("locked_at", {
      withTimezone: true,
      mode: "date",
    }),
    lockedBy: varchar("locked_by", { length: 191 }),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "date",
    }),
    failedAt: timestamp("failed_at", {
      withTimezone: true,
      mode: "date",
    }),
    lastError: text("last_error"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("outbox_events_tenant_event_id_idx").on(
      table.tenantId,
      table.eventId
    ),
    index("outbox_events_tenant_id_idx").on(table.tenantId),
    index("outbox_events_company_id_idx").on(table.companyId),
    index("outbox_events_organization_id_idx").on(table.organizationId),
    index("outbox_events_status_available_at_idx").on(
      table.status,
      table.availableAt
    ),
    index("outbox_events_correlation_id_idx").on(table.correlationId),
    index("outbox_events_event_type_idx").on(table.eventType),
    index("outbox_events_execution_run_id_idx").on(table.executionRunId),
    index("outbox_events_locked_at_idx").on(table.lockedAt),
  ]
);
