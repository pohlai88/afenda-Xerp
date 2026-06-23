import type {
  ClaimOutboxEventsInput,
  MarkOutboxDeadLetterInput,
  MarkOutboxFailedInput,
  MarkOutboxPublishedInput,
  OutboxEventRecord,
  OutboxPersistencePort,
  ReleaseOutboxClaimInput,
} from "@afenda/execution";

type MutableOutboxRecord = OutboxEventRecord;

export function createInMemoryOutboxPersistence(
  initial: readonly OutboxEventRecord[] = []
): OutboxPersistencePort & {
  readonly records: Map<string, MutableOutboxRecord>;
  seed(record: OutboxEventRecord): void;
} {
  const records = new Map(
    initial.map((record) => [record.id, { ...record } as MutableOutboxRecord])
  );

  return {
    records,
    seed(record: OutboxEventRecord) {
      records.set(record.id, { ...record });
    },
    claimPending(input: ClaimOutboxEventsInput) {
      const claimed: MutableOutboxRecord[] = [];

      for (const record of records.values()) {
        if (claimed.length >= input.limit) {
          break;
        }

        if (record.status !== "pending") {
          continue;
        }

        if (record.availableAt > input.nowIso) {
          continue;
        }

        if (
          input.tenantId !== undefined &&
          input.tenantId !== null &&
          record.tenantId !== input.tenantId
        ) {
          continue;
        }

        const locked: MutableOutboxRecord = {
          ...record,
          lockedAt: input.nowIso,
          lockedBy: input.lockedBy,
          status: "processing",
        };

        records.set(record.id, locked);
        claimed.push(locked);
      }

      return Promise.resolve(claimed);
    },
    markPublished(input: MarkOutboxPublishedInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        lockedAt: null,
        lockedBy: null,
        status: "published",
      });

      return Promise.resolve();
    },
    markFailed(input: MarkOutboxFailedInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        attempts: input.attempts,
        availableAt: input.availableAt,
        lockedAt: null,
        lockedBy: null,
        status: "failed",
      });

      return Promise.resolve();
    },
    markDeadLetter(input: MarkOutboxDeadLetterInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        lockedAt: null,
        lockedBy: null,
        status: "dead_letter",
      });

      return Promise.resolve();
    },
    releaseClaim(input: ReleaseOutboxClaimInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        availableAt: input.availableAt,
        lockedAt: null,
        lockedBy: null,
        status: "pending",
      });

      return Promise.resolve();
    },
  };
}
