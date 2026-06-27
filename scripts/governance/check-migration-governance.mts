#!/usr/bin/env tsx
/**
 * Migration governance gate — every journal entry has a complete probe.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MIGRATION_GOVERNANCE_RULES } from "../../packages/database/src/migrations/migration-governance.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const migrationsDir = path.join(repoRoot, "packages/database/src/migrations");

export interface MigrationGovernanceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export function checkMigrationGovernance(): MigrationGovernanceViolation[] {
  const violations: MigrationGovernanceViolation[] = [];
  const journalPath = path.join(migrationsDir, "meta", "_journal.json");

  if (!fs.existsSync(journalPath)) {
    violations.push({
      rule: "journal-missing",
      file: journalPath,
      message: "Drizzle migration journal is missing",
    });
    return violations;
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as {
    entries: Array<{ tag: string }>;
  };

  for (const entry of journal.entries) {
    const rule = MIGRATION_GOVERNANCE_RULES[entry.tag];
    if (!rule) {
      violations.push({
        rule: "governance-probe-missing",
        file: journalPath,
        message: `Missing migration governance probe for ${entry.tag}`,
      });
      continue;
    }

    if (!rule.completeProbe.trim()) {
      violations.push({
        rule: "complete-probe-empty",
        file: journalPath,
        message: `Empty completeProbe for ${entry.tag}`,
      });
    }

    const migrationPath = path.join(migrationsDir, `${entry.tag}.sql`);
    if (!fs.existsSync(migrationPath)) {
      violations.push({
        rule: "migration-file-missing",
        file: migrationPath,
        message: `Journal entry ${entry.tag} has no SQL file`,
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkMigrationGovernance();

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(
        `[${violation.rule}] ${violation.file}: ${violation.message}`
      );
    }
    process.exit(1);
  }

  console.log("Migration governance gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-migration-governance.mts")
    );
  } catch {
    return entry.endsWith("check-migration-governance.mts");
  }
})();

if (isDirectRun) {
  main();
}
