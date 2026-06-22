import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { MIGRATION_GOVERNANCE_RULES } from "../migrations/migration-governance.contract.js";

const migrationsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations"
);

describe("migration governance contract", () => {
  it("defines complete probes for every checked-in journal entry", () => {
    const journal = JSON.parse(
      fs.readFileSync(path.join(migrationsDir, "meta", "_journal.json"), "utf8")
    ) as { entries: Array<{ tag: string }> };

    const missing = journal.entries
      .map((entry) => entry.tag)
      .filter((tag) => !MIGRATION_GOVERNANCE_RULES[tag]);

    expect(missing).toEqual([]);
  });

  it("requires cleanup rules for migrations with partial probes", () => {
    for (const [tag, rule] of Object.entries(MIGRATION_GOVERNANCE_RULES)) {
      if (rule.partialProbe.includes("false AS partial")) {
        expect(rule.partialCleanup, tag).toEqual([]);
        continue;
      }

      expect(rule.partialCleanup.length, tag).toBeGreaterThan(0);
    }
  });
});
