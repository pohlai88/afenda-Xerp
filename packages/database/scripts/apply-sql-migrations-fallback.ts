import fs from "node:fs";

import pg from "pg";

import { resolveMigrationDatabaseUrl } from "../src/env.js";
import {
  loadValidatedMigrationJournal,
  type ValidatedMigrationJournalEntry,
} from "../src/migrations/journal.contract.js";
import { journalPath, loadDatabaseEnv, migrationsDir } from "./load-env.js";

loadDatabaseEnv();

function splitMigrationStatements(sql: string): readonly string[] {
  return sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

async function readAppliedHashes(pool: pg.Pool): Promise<Set<string>> {
  const result = await pool.query<{ hash: string }>(
    "SELECT hash FROM drizzle.__drizzle_migrations"
  );

  return new Set(result.rows.map((row) => row.hash));
}

async function applyMigrationEntry(
  pool: pg.Pool,
  entry: ValidatedMigrationJournalEntry
): Promise<void> {
  const sql = fs.readFileSync(entry.sqlPath, "utf8");
  const statements = splitMigrationStatements(sql);

  for (const statement of statements) {
    await pool.query(statement);
  }

  await pool.query(
    "INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)",
    [entry.hash, entry.when]
  );
}

/** Statement-by-statement apply when drizzle-kit fails (e.g. enum ADD VALUE in txn). */
export async function applyPendingSqlMigrationsFallback(): Promise<number> {
  const entries = loadValidatedMigrationJournal(journalPath, migrationsDir);
  const pool = new pg.Pool({
    connectionString: resolveMigrationDatabaseUrl(),
    max: 1,
    ssl: { rejectUnauthorized: false },
  });

  let applied = 0;

  try {
    const appliedHashes = await readAppliedHashes(pool);
    const pending = entries.filter((entry) => !appliedHashes.has(entry.hash));

    for (const entry of pending) {
      console.log(`migrate-fallback: applying ${entry.tag}`);
      await applyMigrationEntry(pool, entry);
      applied += 1;
    }
  } finally {
    await pool.end();
  }

  return applied;
}
