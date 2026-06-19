import type { ValidatedMigrationJournalEntry } from "./journal.contract.js";

const SHA256_HEX = /^[a-f0-9]{64}$/u;

export interface MigrationLedgerDbRow {
  readonly createdAt: number;
  readonly hash: string;
  readonly id: number;
}

export interface MigrationLedgerDriftIssue {
  readonly code:
    | "created_at_after_journal"
    | "db_only_hash"
    | "hash_mismatch"
    | "invalid_db_hash"
    | "row_count_mismatch";
  readonly message: string;
}

export interface MigrationLedgerExpectation {
  readonly createdAt: number;
  readonly hash: string;
  readonly tag: string;
}

export function buildMigrationLedgerExpectations(
  journalEntries: readonly ValidatedMigrationJournalEntry[],
  appliedThroughIndex: number
): readonly MigrationLedgerExpectation[] {
  return journalEntries
    .filter((entry) => entry.idx <= appliedThroughIndex)
    .map((entry) => ({
      tag: entry.tag,
      hash: entry.hash,
      createdAt: entry.when,
    }));
}

/** Compares the live Drizzle ledger against validated journal expectations. */
export function detectMigrationLedgerDrift(
  journalEntries: readonly ValidatedMigrationJournalEntry[],
  dbRows: readonly MigrationLedgerDbRow[],
  expectedRows: readonly MigrationLedgerExpectation[]
): readonly MigrationLedgerDriftIssue[] {
  const issues: MigrationLedgerDriftIssue[] = [];
  const journalMaxWhen = journalEntries.at(-1)?.when ?? 0;
  const lastDb = dbRows.at(-1);
  const journalHashes = new Set(journalEntries.map((entry) => entry.hash));

  if (lastDb && lastDb.createdAt > journalMaxWhen) {
    issues.push({
      code: "created_at_after_journal",
      message: `Last DB migration created_at (${lastDb.createdAt}) is after journal max when (${journalMaxWhen}).`,
    });
  }

  for (const row of dbRows) {
    if (!SHA256_HEX.test(row.hash)) {
      issues.push({
        code: "invalid_db_hash",
        message: `Invalid migration hash "${row.hash}" in drizzle.__drizzle_migrations (expected sha256 hex).`,
      });
      break;
    }
  }

  if (dbRows.length !== expectedRows.length) {
    issues.push({
      code: "row_count_mismatch",
      message: `Ledger row count mismatch (db=${dbRows.length}, expected=${expectedRows.length}).`,
    });
  }

  const expectedByCreatedAt = new Map(
    expectedRows.map((row) => [row.createdAt, row.hash] as const)
  );

  for (const row of dbRows) {
    const expectedHash = expectedByCreatedAt.get(row.createdAt);
    if (expectedHash && expectedHash !== row.hash) {
      issues.push({
        code: "hash_mismatch",
        message: `Hash mismatch for created_at=${row.createdAt} (db=${row.hash.slice(0, 16)}…).`,
      });
      break;
    }
  }

  for (const row of dbRows) {
    if (!journalHashes.has(row.hash)) {
      issues.push({
        code: "db_only_hash",
        message: `Database ledger contains hash not present in the migration journal (id=${row.id}, hash=${row.hash.slice(0, 16)}…).`,
      });
      break;
    }
  }

  return issues;
}
