import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  assertValidMigrationJournal,
  validateMigrationJournal,
} from "../migrations/journal.contract.js";

const migrationsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations"
);

describe("migration journal contract", () => {
  it("validates the checked-in journal against SQL files", () => {
    const journal = JSON.parse(
      fs.readFileSync(path.join(migrationsDir, "meta", "_journal.json"), "utf8")
    );

    const result = validateMigrationJournal(journal, migrationsDir);

    expect(result.issues).toEqual([]);
    expect(result.entries).toHaveLength(journal.entries.length);
    expect(assertValidMigrationJournal(journal, migrationsDir)).toHaveLength(
      journal.entries.length
    );
  });

  it("reports missing SQL files and orphan migrations", () => {
    const result = validateMigrationJournal(
      {
        entries: [
          {
            idx: 0,
            tag: "missing_migration_tag",
            when: 1,
          },
        ],
      },
      migrationsDir
    );

    expect(result.issues.some((issue) => issue.code === "missing_sql")).toBe(
      true
    );
    expect(result.issues.some((issue) => issue.code === "orphan_sql")).toBe(
      true
    );
  });
});
