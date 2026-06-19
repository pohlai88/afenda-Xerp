import pg from "pg";

import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { loadValidatedMigrationJournal } from "../src/migrations/journal.contract.js";
import {
  buildMigrationLedgerExpectations,
  detectMigrationLedgerDrift,
  type MigrationLedgerDbRow,
} from "../src/migrations/ledger.contract.js";
import { journalPath, loadDatabaseEnv, migrationsDir } from "./load-env.js";

loadDatabaseEnv();

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const dryRun = args.has("--dry-run");

/** Schema probes for migrations that introduce distinctive objects (newest first). */
const MIGRATION_PROBES: Record<string, string> = {
  "20260619250000_policy_governance": `
    SELECT to_regclass('public.policies') IS NOT NULL AS ok`,
  "20260619240000_role_governance": `
    SELECT to_regclass('public.roles') IS NOT NULL AS ok`,
  "20260619230000_membership_governance": `
    SELECT to_regclass('public.memberships') IS NOT NULL AS ok`,
  "20260619220000_organization_governance": `
    SELECT to_regclass('public.organizations') IS NOT NULL AS ok`,
  "20260619213000_company_governance": `
    SELECT to_regclass('public.companies') IS NOT NULL AS ok`,
  "20260619210000_auth_schema_enterprise": `
    SELECT to_regclass('public.auth_user') IS NOT NULL AS ok`,
  "20260619204304_sweet_kingpin": `
    SELECT to_regclass('public.audit_events') IS NOT NULL AS ok`,
  "20260619195805_mushy_kronos": `
    SELECT to_regclass('public.users') IS NOT NULL AS ok`,
  "20260619181744_great_robbie_robertson": `
    SELECT to_regclass('public.tenants') IS NOT NULL AS ok`,
};

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

    const probe = MIGRATION_PROBES[entry.tag];
    if (!probe) {
      continue;
    }

    const result = await pool.query<MigrationProbeQueryRow>(probe);
    if (result.rows[0]?.ok) {
      return entry.idx;
    }
  }

  return -1;
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
  const url = resolveMigrationDatabaseUrl();
  const entries = loadJournalEntries();
  const pool = new pg.Pool({
    connectionString: url,
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
