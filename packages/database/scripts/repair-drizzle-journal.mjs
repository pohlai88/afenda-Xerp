import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import {
  journalPath,
  loadDatabaseEnv,
  migrationsDir,
  resolveMigrationDatabaseUrl,
} from "./_load-env.mjs";

loadDatabaseEnv();

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const dryRun = args.has("--dry-run");

/** Schema probes for migrations that introduce distinctive objects (newest first). */
const MIGRATION_PROBES = {
  "20260619181744_great_robbie_robertson": `
    SELECT to_regclass('public.tenants') IS NOT NULL AS ok`,
};

const SHA256_HEX = /^[a-f0-9]{64}$/;

const loadJournalEntries = () => {
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));

  return journal.entries.map((entry) => {
    const sql = fs.readFileSync(
      path.join(migrationsDir, `${entry.tag}.sql`),
      "utf8"
    );

    return {
      idx: entry.idx,
      tag: entry.tag,
      when: entry.when,
      hash: crypto.createHash("sha256").update(sql).digest("hex"),
    };
  });
};

const readDbMigrations = async (pool) => {
  const result = await pool.query(
    `SELECT id, hash, created_at
     FROM drizzle.__drizzle_migrations
     ORDER BY created_at ASC, id ASC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    hash: row.hash,
    createdAt: Number(row.created_at),
  }));
};

const probeAppliedThroughIndex = async (pool, entries) => {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    const probe = MIGRATION_PROBES[entry.tag];
    if (!probe) {
      continue;
    }

    const result = await pool.query(probe);
    if (result.rows[0]?.ok) {
      return entry.idx;
    }
  }

  return -1;
};

const buildExpectedRows = (entries, appliedThrough) =>
  entries
    .filter((entry) => entry.idx <= appliedThrough)
    .map((entry) => ({
      hash: entry.hash,
      createdAt: entry.when,
      tag: entry.tag,
    }));

const detectDrift = (entries, dbRows, expectedRows) => {
  const reasons = [];
  const journalMaxWhen = entries.at(-1)?.when ?? 0;
  const lastDb = dbRows.at(-1);

  if (lastDb && lastDb.createdAt > journalMaxWhen) {
    reasons.push(
      `last migration created_at (${lastDb.createdAt}) is after journal max when (${journalMaxWhen})`
    );
  }

  for (const row of dbRows) {
    if (!SHA256_HEX.test(row.hash)) {
      reasons.push(
        `invalid migration hash "${row.hash}" (expected sha256 hex)`
      );
      break;
    }
  }

  if (dbRows.length !== expectedRows.length) {
    reasons.push(
      `row count mismatch (db=${dbRows.length}, expected=${expectedRows.length})`
    );
  }

  const expectedByCreatedAt = new Map(
    expectedRows.map((row) => [row.createdAt, row.hash])
  );

  for (const row of dbRows) {
    const expectedHash = expectedByCreatedAt.get(row.createdAt);
    if (expectedHash && expectedHash !== row.hash) {
      reasons.push(`hash mismatch for created_at=${row.createdAt}`);
      break;
    }
  }

  return reasons;
};

const repairJournal = async () => {
  const url = resolveMigrationDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL_DIRECT, DATABASE_URL, or Supabase password/project config is required"
    );
  }

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
