import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { journalPath, loadDatabaseEnv, migrationsDir } from "./load-env.js";

loadDatabaseEnv();

const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as {
  entries: Array<{ idx: number; tag: string }>;
};

const hashFile = (tag: string) => {
  const sql = fs.readFileSync(path.join(migrationsDir, `${tag}.sql`), "utf8");
  return crypto.createHash("sha256").update(sql).digest("hex");
};

const url = resolveMigrationDatabaseUrl();

const pool = new pg.Pool({
  connectionString: url,
  max: 1,
  ssl: { rejectUnauthorized: false },
});

try {
  const dbRows = await pool.query(
    "SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id"
  );
  const dbHashes = new Set(dbRows.rows.map((row) => row.hash as string));

  console.log("DB migration rows:");
  for (const row of dbRows.rows) {
    const hash = row.hash as string;
    console.log(`  id=${row.id} hash=${hash.slice(0, 16)}...`);
  }

  console.log("\nJournal vs DB:");
  for (const entry of journal.entries) {
    const hash = hashFile(entry.tag);
    const inDb = dbHashes.has(hash);
    console.log(
      `${inDb ? "✓" : "✗"} idx=${entry.idx} ${entry.tag} hash=${hash.slice(0, 16)}...`
    );
  }
} finally {
  await pool.end();
}
