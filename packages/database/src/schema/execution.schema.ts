/**
 * Execution run persistence registry.
 *
 * Owns durable execution metadata only. Trigger.dev run orchestration stays in
 * `@afenda/execution` provider adapters.
 */
import {
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { executionStatusEnum } from "../database.types.js";
import {
  companyIdRef,
  enterpriseIdColumn,
  enterpriseIdFormatCheck,
  enterpriseIdUniqueIndexName,
  organizationIdRef,
  primaryId,
  tenantForeignKeyIndexName,
  tenantIdRef,
} from "../ids.js";
import { createdAtColumn } from "../timestamps.js";
import { companies } from "./company.schema.js";
import { organizations } from "./organization.schema.js";
import { tenants } from "./tenant.schema.js";

export const executionRuns = pgTable(
  "execution_runs",
  {
    executionId: primaryId("execution_id"),
    enterpriseId: enterpriseIdColumn("execution"),
    workflowId: varchar("workflow_id", { length: 191 }).notNull(),
    triggerTaskId: varchar("trigger_task_id", { length: 191 }).notNull(),
    providerRunId: varchar("provider_run_id", { length: 191 }),
    status: executionStatusEnum("status").notNull(),
    attempt: integer("attempt").notNull().default(1),
    correlationId: varchar("correlation_id", { length: 191 }).notNull(),
    tenantId: tenantIdRef().references(() => tenants.id, {
      onDelete: "set null",
    }),
    companyId: companyIdRef().references(() => companies.id, {
      onDelete: "set null",
    }),
    organizationId: organizationIdRef().references(() => organizations.id, {
      onDelete: "set null",
    }),
    actorId: varchar("actor_id", { length: 191 }),
    source: varchar("source", { length: 64 }).notNull(),
    context: jsonb("context").notNull().default({}),
    payload: jsonb("payload").notNull().default({}),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    finishedAt: timestamp("finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: createdAtColumn(),
  },
  (table) => [
    uniqueIndex(enterpriseIdUniqueIndexName("execution_runs")).on(
      table.enterpriseId
    ),
    enterpriseIdFormatCheck(table.enterpriseId, "execution"),
    index("execution_runs_workflow_id_idx").on(table.workflowId),
    index("execution_runs_status_idx").on(table.status),
    index("execution_runs_correlation_id_idx").on(table.correlationId),
    index(tenantForeignKeyIndexName("execution_runs")).on(table.tenantId),
    index("execution_runs_provider_run_id_idx").on(table.providerRunId),
    index("execution_runs_started_at_idx").on(table.startedAt),
  ]
);
