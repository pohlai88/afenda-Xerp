import fs from "node:fs";

import {
  assertValidMigrationJournal,
  validateMigrationJournal,
} from "../src/migrations/journal.contract.js";
import { journalPath, loadDatabaseEnv, migrationsDir } from "./load-env.js";

loadDatabaseEnv();

const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
const result = validateMigrationJournal(journal, migrationsDir);

if (result.issues.length > 0) {
  console.error("migration journal validation failed:");
  for (const issue of result.issues) {
    console.error(`  [${issue.code}] ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  const entries = assertValidMigrationJournal(journal, migrationsDir);
  console.log(
    `migration journal valid (${entries.length} entries, ${entries.at(-1)?.tag})`
  );
}
