import { type AfendaDatabase, getDb, outboxEvents } from "@afenda/database";
import type {
  ClaimOutboxEventsInput,
  MarkOutboxDeadLetterInput,
  MarkOutboxFailedInput,
  MarkOutboxPublishedInput,
  OutboxEventRecord,
  OutboxPersistencePort,
  ReleaseOutboxClaimInput,
} from "@afenda/execution";
import { and, eq, lte, sql } from "drizzle-orm";

function toIsoString(value: Date | string | null): string | null {
  if (value === null) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function mapRowToRecord(
  row: typeof outboxEvents.$inferSelect
): OutboxEventRecord {
  return {
    actorId: row.actorId,
    actorType: row.actorType,
    attempts: row.attempts,
    availableAt: toIsoString(row.availableAt) ?? new Date(0).toISOString(),
    causationId: row.causationId,
    companyId: row.companyId,
    correlationId: row.correlationId,
    eventId: row.eventId,
    eventType: row.eventType,
    eventVersion: row.eventVersion,
    executionRunId: row.executionRunId,
    id: row.id,
    lockedAt: toIsoString(row.lockedAt),
    lockedBy: row.lockedBy,
    maxAttempts: row.maxAttempts,
    metadata: row.metadata as OutboxEventRecord["metadata"],
    organizationId: row.organizationId,
    payload: row.payload as OutboxEventRecord["payload"],
    reason: row.reason,
    status: row.status,
    summary: row.summary,
    tenantId: row.tenantId,
  };
}

export function createDrizzleOutboxPersistenceAdapter(
  db: AfendaDatabase = getDb()
): OutboxPersistencePort {
  return {
    claimPending(input: ClaimOutboxEventsInput) {
      return db.transaction(async (tx) => {
        const conditions = [
          eq(outboxEvents.status, "pending"),
          lte(outboxEvents.availableAt, new Date(input.nowIso)),
        ];

        if (input.tenantId !== undefined && input.tenantId !== null) {
          conditions.push(eq(outboxEvents.tenantId, input.tenantId));
        }

        const rows = await tx
          .select()
          .from(outboxEvents)
          .where(and(...conditions))
          .orderBy(outboxEvents.availableAt)
          .limit(input.limit)
          .for("update", { skipLocked: true });

        const claimed: OutboxEventRecord[] = [];

        for (const row of rows) {
          const [updated] = await tx
            .update(outboxEvents)
            .set({
              lockedAt: new Date(input.nowIso),
              lockedBy: input.lockedBy,
              status: "processing",
              updatedAt: sql`now()`,
            })
            .where(eq(outboxEvents.id, row.id))
            .returning();

          if (updated !== undefined) {
            claimed.push(mapRowToRecord(updated));
          }
        }

        return claimed;
      });
    },
    async markPublished(input: MarkOutboxPublishedInput) {
      await db
        .update(outboxEvents)
        .set({
          lockedAt: null,
          lockedBy: null,
          publishedAt: new Date(input.publishedAt),
          status: "published",
          updatedAt: sql`now()`,
        })
        .where(eq(outboxEvents.id, input.id));
    },
    async markFailed(input: MarkOutboxFailedInput) {
      await db
        .update(outboxEvents)
        .set({
          attempts: input.attempts,
          availableAt: new Date(input.availableAt),
          failedAt: new Date(input.failedAt),
          lastError: input.lastError,
          lockedAt: null,
          lockedBy: null,
          status: "failed",
          updatedAt: sql`now()`,
        })
        .where(eq(outboxEvents.id, input.id));
    },
    async markDeadLetter(input: MarkOutboxDeadLetterInput) {
      await db
        .update(outboxEvents)
        .set({
          failedAt: new Date(input.failedAt),
          lastError: input.lastError,
          lockedAt: null,
          lockedBy: null,
          status: "dead_letter",
          updatedAt: sql`now()`,
        })
        .where(eq(outboxEvents.id, input.id));
    },
    async releaseClaim(input: ReleaseOutboxClaimInput) {
      await db
        .update(outboxEvents)
        .set({
          availableAt: new Date(input.availableAt),
          lockedAt: null,
          lockedBy: null,
          status: "pending",
          updatedAt: sql`now()`,
        })
        .where(eq(outboxEvents.id, input.id));
    },
  };
}
