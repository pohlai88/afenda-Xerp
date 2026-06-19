import fs from "node:fs";
import pg from "pg";
import {
  journalPath,
  loadDatabaseEnv,
  resolveMigrationDatabaseUrl,
} from "./_load-env.mjs";

loadDatabaseEnv();

const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
const tags = journal.entries.map((entry) => entry.tag);
const url = resolveMigrationDatabaseUrl();

if (!url) {
  console.error("No migration database URL configured.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: url,
  max: 1,
  ssl: { rejectUnauthorized: false },
});

try {
  const rows = await pool.query(
    "SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id"
  );
  console.log("drizzle_url_host:", new URL(url).hostname);
  console.log("db_rows:", rows.rows.length);
  console.log("journal_tags:", tags.length, tags.slice(-5).join(", "));
  console.log("last_db_ids:", rows.rows.map((row) => row.id).join(", "));
} finally {
  await pool.end();
}
