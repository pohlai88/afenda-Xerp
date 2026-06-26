import { and, eq, gt } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { apiIdempotencyRecords } from "../schema/api-governance.schema.js";

export interface ApiIdempotencyStoredResponse {
  readonly data: unknown;
  readonly statusCode: number;
}

export interface WriteApiIdempotencyRecordInput {
  readonly data: unknown;
  readonly scopeKey: string;
  readonly statusCode: number;
  readonly ttlHours?: number;
}

const DEFAULT_IDEMPOTENCY_TTL_HOURS = 24;

function resolveExpiresAt(ttlHours: number): Date {
  return new Date(Date.now() + ttlHours * 60 * 60 * 1000);
}

export async function readApiIdempotencyRecord(
  scopeKey: string,
  db: AfendaDatabase = getDb()
): Promise<ApiIdempotencyStoredResponse | null> {
  const now = new Date();
  const [row] = await db
    .select({
      data: apiIdempotencyRecords.responseData,
      statusCode: apiIdempotencyRecords.statusCode,
    })
    .from(apiIdempotencyRecords)
    .where(
      and(
        eq(apiIdempotencyRecords.scopeKey, scopeKey),
        gt(apiIdempotencyRecords.expiresAt, now)
      )
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    data: row.data,
    statusCode: row.statusCode,
  };
}

export async function writeApiIdempotencyRecord(
  input: WriteApiIdempotencyRecordInput,
  db: AfendaDatabase = getDb()
): Promise<void> {
  const ttlHours = input.ttlHours ?? DEFAULT_IDEMPOTENCY_TTL_HOURS;

  await db
    .insert(apiIdempotencyRecords)
    .values({
      expiresAt: resolveExpiresAt(ttlHours),
      responseData: input.data,
      scopeKey: input.scopeKey,
      statusCode: input.statusCode,
    })
    .onConflictDoNothing({
      target: apiIdempotencyRecords.scopeKey,
    });
}
