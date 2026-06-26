/**
 * Platform tables for governed ERP API runtime (idempotency replay + rate limiting).
 *
 * Write path: `@afenda/database` api-governance services
 * Consumer: `apps/erp/src/server/api/runtime/`
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
import { primaryId } from "../ids.js";
import { createdAtColumn, updatedAtColumn } from "../timestamps.js";

export const apiIdempotencyRecords = pgTable(
  "api_idempotency_records",
  {
    id: primaryId(),
    scopeKey: varchar("scope_key", { length: 512 }).notNull(),
    statusCode: integer("status_code").notNull(),
    responseData: jsonb("response_data").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => [
    uniqueIndex("api_idempotency_records_scope_key_uidx").on(table.scopeKey),
    index("api_idempotency_records_expires_at_idx").on(table.expiresAt),
  ]
);

export const apiRateLimitBuckets = pgTable(
  "api_rate_limit_buckets",
  {
    id: primaryId(),
    bucketKey: varchar("bucket_key", { length: 512 }).notNull(),
    windowStart: timestamp("window_start", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    requestCount: integer("request_count").notNull().default(1),
    windowSeconds: integer("window_seconds").notNull(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    uniqueIndex("api_rate_limit_buckets_bucket_key_uidx").on(table.bucketKey),
  ]
);
