import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const MIGRATION_MAP_PATH = path.join(PACKAGE_ROOT, "docs/MIGRATION-MAP.md");
const RETIREMENT_PLAN_PATH = path.join(
  PACKAGE_ROOT,
  "docs/LEGACY-RETIREMENT-PLAN.md"
);

const ALLOWED_STATUSES = new Set([
  "blocked",
  "migrated",
  "quarantined",
  "replaced",
  "retired",
]);

function stripCodeTicks(value: string): string {
  return value.replaceAll("`", "");
}

interface MigrationRow {
  readonly destination: string;
  readonly legacyPath: string;
  readonly status: string;
}

function parseMigrationRows(): MigrationRow[] {
  const source = readFileSync(MIGRATION_MAP_PATH, "utf8");
  const rows: MigrationRow[] = [];

  for (const line of source.split("\n")) {
    if (!(line.startsWith("| `") && line.includes(" | `"))) {
      continue;
    }

    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 4) {
      continue;
    }

    rows.push({
      destination: stripCodeTicks(cells[1] ?? ""),
      legacyPath: stripCodeTicks(cells[0] ?? ""),
      status: stripCodeTicks(cells[2] ?? ""),
    });
  }

  return rows;
}

describe("Slice 9 legacy retirement planning", () => {
  it("categorizes every migration-map row with a non-pending status", () => {
    const rows = parseMigrationRows();

    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((row) => row.status)).not.toContain("pending");
    expect(rows.every((row) => ALLOWED_STATUSES.has(row.status))).toBe(true);
  });

  it("keeps retired status out until release-owner deletion proof exists", () => {
    const rows = parseMigrationRows();

    expect(rows.map((row) => row.status)).not.toContain("retired");
  });

  it("keeps retirement planning V2-local and non-destructive", () => {
    const plan = readFileSync(RETIREMENT_PLAN_PATH, "utf8");

    expect(plan).toContain("does not delete legacy code");
    expect(plan).toContain("Deletion authority: not granted");
    expect(plan).toContain("Do not delete legacy package files.");
  });
});
