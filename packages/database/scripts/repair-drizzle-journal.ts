import pg from "pg";

import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { loadValidatedMigrationJournal } from "../src/migrations/journal.contract.js";
import {
  buildMigrationLedgerExpectations,
  detectMigrationLedgerDrift,
  type MigrationLedgerDbRow,
} from "../src/migrations/ledger.contract.js";
import { MIGRATION_GOVERNANCE_RULES } from "../src/migrations/migration-governance.contract.js";
import { connectPgPoolWithFallback } from "../src/supabase/pg-network-fallback.server.js";
import { journalPath, loadDatabaseEnv, migrationsDir } from "./load-env.js";

loadDatabaseEnv();

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const dryRun = args.has("--dry-run");

interface LoadedJournalEntry {
  hash: string;
  idx: number;
  tag: string;
  when: number;
}

type DbMigrationRow = MigrationLedgerDbRow;

interface DrizzleMigrationQueryRow {
  readonly created_at: string | number;
  readonly hash: string;
  readonly id: string | number;
}

interface MigrationProbeQueryRow {
  readonly ok: boolean | null;
}

interface MigrationPartialQueryRow {
  readonly partial: boolean | null;
}

const loadJournalEntries = (): LoadedJournalEntry[] => {
  const entries = loadValidatedMigrationJournal(journalPath, migrationsDir);
  console.log(
    `migrate: journal valid (${entries.length} entries, ${entries.at(-1)?.tag})`
  );

  return entries.map((entry) => ({
    idx: entry.idx,
    tag: entry.tag,
    when: entry.when,
    hash: entry.hash,
  }));
};

const readDbMigrations = async (pool: pg.Pool): Promise<DbMigrationRow[]> => {
  const result = await pool.query<DrizzleMigrationQueryRow>(
    `SELECT id, hash, created_at
     FROM drizzle.__drizzle_migrations
     ORDER BY created_at ASC, id ASC`
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    hash: String(row.hash),
    createdAt: Number(row.created_at),
  }));
};

const probeAppliedThroughIndex = async (
  pool: pg.Pool,
  entries: LoadedJournalEntry[]
): Promise<number> => {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    if (!entry) {
      continue;
    }

    const rule = MIGRATION_GOVERNANCE_RULES[entry.tag];
    if (!rule) {
      continue;
    }

    const result = await pool.query<MigrationProbeQueryRow>(rule.completeProbe);
    if (result.rows[0]?.ok) {
      return entry.idx;
    }
  }

  return -1;
};

const normalizePartialMigrationArtifacts = async (
  pool: pg.Pool,
  entries: LoadedJournalEntry[],
  appliedThrough: number
): Promise<number> => {
  let normalizedCount = 0;

  for (const entry of entries) {
    if (entry.idx <= appliedThrough) {
      continue;
    }

    const rule = MIGRATION_GOVERNANCE_RULES[entry.tag];
    if (!rule || rule.partialCleanup.length === 0) {
      continue;
    }

    const complete = await pool.query<MigrationProbeQueryRow>(
      rule.completeProbe
    );
    if (complete.rows[0]?.ok) {
      continue;
    }

    const partial = await pool.query<MigrationPartialQueryRow>(
      rule.partialProbe
    );
    if (!partial.rows[0]?.partial) {
      continue;
    }

    console.log(`normalize: cleaning partial artifacts for ${entry.tag}`);
    if (dryRun) {
      normalizedCount += 1;
      continue;
    }

    for (const statement of rule.partialCleanup) {
      await pool.query(statement);
    }
    normalizedCount += 1;
  }

  if (normalizedCount > 0 && !dryRun) {
    console.log(`normalize: cleaned ${normalizedCount} partial migration(s)`);
  }

  return normalizedCount;
};

const buildExpectedRows = (
  entries: LoadedJournalEntry[],
  appliedThrough: number
) => buildMigrationLedgerExpectations(entries, appliedThrough);

const detectDrift = (
  entries: LoadedJournalEntry[],
  dbRows: DbMigrationRow[],
  expectedRows: ReturnType<typeof buildExpectedRows>
) =>
  detectMigrationLedgerDrift(entries, dbRows, expectedRows).map(
    (issue) => issue.message
  );

const repairJournal = async () => {
  const entries = loadJournalEntries();
  const pool = checkOnly
    ? await connectPgPoolWithFallback({
        connectionConsumer: "drizzle-migrations",
        fallbackOnNetworkError: true,
        purpose: "ledger check",
        poolConfig: {
          max: 1,
          ssl: { rejectUnauthorized: false },
        },
      })
    : new pg.Pool({
        connectionString: resolveMigrationDatabaseUrl(),
        max: 1,
        ssl: { rejectUnauthorized: false },
      });

  try {
    const appliedThrough = await probeAppliedThroughIndex(pool, entries);
    if (appliedThrough < 0) {
      console.log(
        "repair: no applied migrations detected — leaving journal untouched"
      );
      return { repaired: false, appliedThrough };
    }

    await normalizePartialMigrationArtifacts(pool, entries, appliedThrough);

    const expectedRows = buildExpectedRows(entries, appliedThrough);
    const dbRows = await readDbMigrations(pool);
    const drift = detectDrift(entries, dbRows, expectedRows);

    if (drift.length === 0) {
      console.log(
        `repair: journal in sync (${expectedRows.length} migrations through ${expectedRows.at(-1)?.tag})`
      );
      return { repaired: false, appliedThrough };
    }

    console.log("repair: drift detected:");
    for (const reason of drift) {
      console.log(`  - ${reason}`);
    }

    if (checkOnly) {
      console.error(
        "repair: journal drift — run pnpm --filter @afenda/database db:repair-journal"
      );
      process.exitCode = 1;
      return { repaired: false, appliedThrough, drift };
    }

    if (dryRun) {
      console.log(
        `repair: dry-run would rewrite ${expectedRows.length} rows through ${expectedRows.at(-1)?.tag}`
      );
      return { repaired: false, appliedThrough, drift, dryRun: true };
    }

    await pool.query("BEGIN");
    try {
      await pool.query("DELETE FROM drizzle.__drizzle_migrations");

      for (const row of expectedRows) {
        await pool.query(
          "INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)",
          [row.hash, row.createdAt]
        );
      }

      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }

    console.log(
      `repair: rewrote ${expectedRows.length} rows through ${expectedRows.at(-1)?.tag}`
    );
    return { repaired: true, appliedThrough };
  } finally {
    await pool.end();
  }
};

await repairJournal();
