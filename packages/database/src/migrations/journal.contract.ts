import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export interface MigrationJournalEntry {
  readonly breakpoints?: boolean;
  readonly idx: number;
  readonly tag: string;
  readonly version?: string;
  readonly when: number;
}

export interface MigrationJournalFile {
  readonly dialect?: string;
  readonly entries: readonly MigrationJournalEntry[];
  readonly version?: string;
}

export interface MigrationJournalIssue {
  readonly code:
    | "duplicate_tag"
    | "idx_mismatch"
    | "missing_sql"
    | "orphan_sql"
    | "unreadable_sql";
  readonly message: string;
}

export interface ValidatedMigrationJournalEntry extends MigrationJournalEntry {
  readonly hash: string;
  readonly sqlPath: string;
}

export interface MigrationJournalValidationResult {
  readonly entries: readonly ValidatedMigrationJournalEntry[];
  readonly issues: readonly MigrationJournalIssue[];
}

function hashMigrationSql(sql: string): string {
  return crypto.createHash("sha256").update(sql).digest("hex");
}

/** Offline journal integrity checks — no database connection required. */
export function validateMigrationJournal(
  journal: MigrationJournalFile,
  migrationsDir: string
): MigrationJournalValidationResult {
  const issues: MigrationJournalIssue[] = [];
  const validatedEntries: ValidatedMigrationJournalEntry[] = [];
  const journalTags = new Set<string>();

  for (const [index, entry] of journal.entries.entries()) {
    issues.push(
      ...validateJournalEntry(
        entry,
        index,
        migrationsDir,
        journalTags,
        validatedEntries
      )
    );
  }

  issues.push(...findOrphanMigrationSqlFiles(migrationsDir, journalTags));

  return { entries: validatedEntries, issues };
}

function validateJournalEntry(
  entry: MigrationJournalEntry,
  index: number,
  migrationsDir: string,
  journalTags: Set<string>,
  validatedEntries: ValidatedMigrationJournalEntry[]
): MigrationJournalIssue[] {
  const issues: MigrationJournalIssue[] = [];

  if (entry.idx !== index) {
    issues.push({
      code: "idx_mismatch",
      message: `Journal entry "${entry.tag}" has idx=${entry.idx}; expected ${index}.`,
    });
  }

  if (journalTags.has(entry.tag)) {
    issues.push({
      code: "duplicate_tag",
      message: `Duplicate migration tag "${entry.tag}" in journal.`,
    });
  }
  journalTags.add(entry.tag);

  const sqlPath = path.join(migrationsDir, `${entry.tag}.sql`);
  if (!fs.existsSync(sqlPath)) {
    issues.push({
      code: "missing_sql",
      message: `Missing SQL file for journal tag "${entry.tag}" at ${sqlPath}.`,
    });
    return issues;
  }

  try {
    const sql = fs.readFileSync(sqlPath, "utf8");
    validatedEntries.push({
      ...entry,
      hash: hashMigrationSql(sql),
      sqlPath,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    issues.push({
      code: "unreadable_sql",
      message: `Unable to read migration "${entry.tag}": ${reason}`,
    });
  }

  return issues;
}

function findOrphanMigrationSqlFiles(
  migrationsDir: string,
  journalTags: Set<string>
): MigrationJournalIssue[] {
  const issues: MigrationJournalIssue[] = [];

  if (!fs.existsSync(migrationsDir)) {
    return issues;
  }

  for (const fileName of fs.readdirSync(migrationsDir)) {
    if (!fileName.endsWith(".sql")) {
      continue;
    }

    const tag = fileName.slice(0, -".sql".length);
    if (!journalTags.has(tag)) {
      issues.push({
        code: "orphan_sql",
        message: `SQL file "${fileName}" is not listed in the migration journal.`,
      });
    }
  }

  return issues;
}

export function assertValidMigrationJournal(
  journal: MigrationJournalFile,
  migrationsDir: string
): readonly ValidatedMigrationJournalEntry[] {
  const result = validateMigrationJournal(journal, migrationsDir);

  if (result.issues.length > 0) {
    const details = result.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid migration journal: ${details}`);
  }

  return result.entries;
}

/** Loads and validates the Drizzle journal from disk (offline, no DB). */
export function loadValidatedMigrationJournal(
  journalFilePath: string,
  migrationsDirectory: string
): readonly ValidatedMigrationJournalEntry[] {
  const journal = JSON.parse(
    fs.readFileSync(journalFilePath, "utf8")
  ) as MigrationJournalFile;

  return assertValidMigrationJournal(journal, migrationsDirectory);
}
